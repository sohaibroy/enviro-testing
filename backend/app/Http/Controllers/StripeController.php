<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\Orders;
use App\Models\OrderDetails;
use App\Models\OrderEquipment;
use App\Models\Transactions;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Checkout\Session;
use Stripe\Webhook;
use App\Mail\CustomerOrderConfirmationMail;
use App\Mail\CompanyOrderNotificationMail;
use App\Mail\CustomerPaidReceiptMail;
use App\Models\Accounts;
use App\Models\Analytes;
use App\Models\Methods;
use App\Models\Equipment;


class StripeController extends Controller
{
    public function create(Request $request)
    {
        require_once base_path('stripe-php-17.3.0/init.php');
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $amount = $request->input('amount');

        try {
            $intent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'cad',
                'automatic_payment_methods' => ['enabled' => true],
            ]);

            return response()->json(['clientSecret' => $intent->client_secret]);
        } catch (\Exception $e) {

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createCheckoutSession(Request $request)
{
    require_once base_path('stripe-php-17.3.0/init.php');
    Stripe::setApiKey(env('STRIPE_SECRET'));

    $amount = $request->input('amount');
    $transactionId = $request->input('transaction_id');
    $frontendUrl = env('FRONTEND_URL');

    if (!$frontendUrl || !filter_var($frontendUrl, FILTER_VALIDATE_URL)) {
        return response()->json(['error' => 'Invalid FRONTEND_URL'], 500);
    }

    try {
        //Cache analyte + equipment with potentially long comments
        Cache::put("order_session_$transactionId", [
            'analytes' => $request->input('analytes', []),
            'equipment' => $request->input('equipment', []),
        ], now()->addMinutes(60));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'cad',
                    'product_data' => ['name' => 'Your Order'],
                    'unit_amount' => $amount,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => $frontendUrl . '/order-confirmation?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $frontendUrl . '/payment-failed',
            'metadata' => [
                'transaction_id' => $transactionId, //only metadata now
            ],
        ]);

        return response()->json(['url' => $session->url]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


public function handleWebhook(Request $request)
{
    require_once base_path('stripe-php-17.3.0/init.php');

    $payload   = $request->getContent();
    $sigHeader = $request->server('HTTP_STRIPE_SIGNATURE');
    $secret    = env('STRIPE_WEBHOOK_SECRET');

    try {
        $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $secret);
        $eventType = $event->type;

        if ($eventType === 'checkout.session.completed') {
            /** @var \Stripe\Checkout\Session $session */
            $session = $event->data->object;

            if (($session->payment_status ?? '') !== 'paid') {
                return response('Payment not completed', 200);
            }

            //Existing PO order paid from the customer portal =====
            $existingOrderId = $session->metadata->existing_order_id ?? null;
            if (!empty($existingOrderId)) {
                $orderId = (int) $existingOrderId;
                /** @var Orders|null $order */
                $order = Orders::find($orderId);
                if (!$order) {
                    return response('Order not found', 404);
                }

                DB::beginTransaction();
                try {
                    //Idempotent paid update
                    if (($order->payment_status ?? '') !== 'paid') {
                        $order->update([
                            'payment_status'           => 'paid',
                            'payment_method'           => 'Credit Card',
                            'payment_received_at'      => now(),
                            'payment_reference'        => $session->payment_intent ?? null,
                            'stripe_session_id'        => $session->id ?? null,
                            'stripe_payment_intent_id' => $session->payment_intent ?? null,
                            'updated_at'               => now(),
                        ]);
                    }

                    //Ensure a transaction exists for this (legacy PO might be null)
                    if (empty($order->transaction_id)) {
                        $txnId = DB::table('transactions')->insertGetId([
                            'account_id'   => $order->account_id,
                            'subtotal'     => $order->subtotal,
                            'gst'          => $order->gst,
                            'total_amount' => $order->total_amount,
                            'created_at'   => now(),
                            'updated_at'   => now(),
                        ]);
                        $order->update(['transaction_id' => $txnId]);

                        // Optional payments row
                        DB::table('payments')->insert([
                            'transaction_id'    => $txnId,
                            'payment_method'    => 'credit_card',
                            'payment_status'    => 'paid',
                            'amount'            => $order->total_amount,
                            'card_holder_name'  => null,
                            'card_expiry_month' => null,
                            'card_expiry_year'  => null,
                            'card_last_four'    => null,
                            'created_at'        => now(),
                            'updated_at'        => now(),
                        ]);
                    }

                    DB::commit();

                    //Send FINAL PAID RECEIPT (customer) ---
                    $account = Accounts::find($order->account_id);
                    if ($account && $account->email) {
                        try {
                            Mail::to($account->email)->send(new CustomerPaidReceiptMail($order));
                        } catch (\Throwable $e) {
                            Log::warning('[paid receipt] customer email failed', [
                                'order_id' => $order->order_id,
                                'err'      => $e->getMessage()
                            ]);
                        }
                    }

                    //internal copy
                    try {
                        Mail::to('roysohaib@hotmail.com')->send(new CustomerPaidReceiptMail($order));
                    } catch (\Throwable $e) {}

                    return response('PO order marked paid', 200);
                } catch (\Throwable $e) {
                    DB::rollBack();
                    Log::error('[handleWebhook existing_order] '.$e->getMessage(), ['order_id' => $orderId]);
                    return response('Webhook error', 500);
                }
            }

            //New Card Checkout flow (non-PO)
            $metadata      = $session->metadata ? $session->metadata->toArray() : [];
            $transactionId = $metadata['transaction_id'] ?? null;

            if (!$transactionId) {
                return response('Missing transaction_id', 400);
            }

            $subtotal = ($session->amount_subtotal ?? 0) / 100;
            $gst      = round($subtotal * 0.05, 2);
            $total    = ($session->amount_total ?? 0) / 100;

            //If order exists for this transaction, just sync amounts & mark paid
            $existingOrder = Orders::where('transaction_id', $transactionId)->first();
            if ($existingOrder) {
                $existingOrder->update([
                    'subtotal'                  => $subtotal,
                    'gst'                       => $gst,
                    'total_amount'              => $total,
                    'payment_status'            => 'paid',
                    'payment_method'            => 'Credit Card',
                    'payment_received_at'       => now(),
                    'payment_reference'         => $session->payment_intent ?? null,
                    'stripe_session_id'         => $session->id ?? null,
                    'stripe_payment_intent_id'  => $session->payment_intent ?? null,
                    'updated_at'                => now(),
                ]);

                //Send FINAL PAID RECEIPT (customer)
                $account = Accounts::find($existingOrder->account_id);
                if ($account && $account->email) {
                    try {
                        Mail::to($account->email)->send(new CustomerPaidReceiptMail($existingOrder));
                    } catch (\Throwable $e) {
                        Log::warning('[paid receipt] customer email failed (existing)', [
                            'order_id' => $existingOrder->order_id,
                            'err'      => $e->getMessage()
                        ]);
                    }
                }
                //internal copy
                try {
                    Mail::to('roysohaib@hotmail.com')->send(new CustomerPaidReceiptMail($existingOrder));
                } catch (\Throwable $e) {}

                return response('Order updated', 200);
            }

            //Create order from cached payload (analytes + equipment)
            $transaction = Transactions::where('transaction_id', $transactionId)->first();
            if (!$transaction) {
                return response('Transaction not found', 404);
            }

            $cached    = Cache::get("order_session_$transactionId");
            $analytes  = $cached['analytes']  ?? [];
            $equipment = $cached['equipment'] ?? [];

            DB::beginTransaction();
            try {
                $order = Orders::create([
                    'account_id'                => $transaction->account_id,
                    'transaction_id'            => $transactionId,
                    'order_date'                => now(),
                    'subtotal'                  => $subtotal,
                    'gst'                       => $gst,
                    'total_amount'              => $total,
                    'payment_status'            => 'paid',
                    'payment_method'            => 'Credit Card',
                    'status'                    => 0,
                    'stripe_session_id'         => $session->id ?? null,
                    'stripe_payment_intent_id'  => $session->payment_intent ?? null,
                    'created_at'                => now(),
                    'updated_at'                => now(),
                ]);

                foreach ($analytes as $a) {
                    if (!isset($a['analyte']) || !isset($a['method'])) continue;

                    $analyte = Analytes::where('analyte_name', $a['analyte'])->first();
                    $method  = Methods::where('method_name',  $a['method'])->first();
                    if (!$analyte || !$method) {
                        Log::error('[Webhook] Could not resolve analyte/method', ['a' => $a]);
                        continue;
                    }

                    OrderDetails::create([
                        'order_id'          => $order->order_id,
                        'analyte_id'        => $analyte->analyte_id,
                        'method_id'         => $method->method_id,
                        'turn_around_id'    => $a['turnaround_time_id'] ?? ($a['turnaround']['id'] ?? null),
                        'required_quantity' => $a['required_quantity'] ?? 1,
                        'price'             => ($a['required_quantity'] ?? 1) * $a['price'],
                        'required_pumps'    => $a['required_pumps'] ?? null,
                        'required_media'    => $a['required_media'] ?? null,
                        'customer_comment'  => $a['customer_comment'] ?? null,
                    ]);
                }

                foreach ($equipment as $e) {
                    if (!isset($e['equipment_id'])) continue;

                    $equipmentMeta = Equipment::with('equipmentType')->find($e['equipment_id']);
                    if (!$equipmentMeta) continue;

                    OrderEquipment::create([
                        'order_id'       => $order->order_id,
                        'equipment_id'   => $e['equipment_id'],
                        'equipment_name' => $equipmentMeta->equipment_name,
                        'category'       => $equipmentMeta->equipmentType->equipment_type_name ?? 'Unknown',
                        'start_date'     => $e['start_date'],
                        'return_date'    => $e['return_date'],
                        'quantity'       => $e['quantity'],
                        'daily_cost'     => $e['daily_cost'],
                    ]);

                    //Mark serials rented
                    $availableSerials = DB::table('equipment_details')
                        ->where('equipment_id', $e['equipment_id'])
                        ->where('status', 'available')
                        ->limit($e['quantity'])
                        ->pluck('serial_id');

                    if ($availableSerials->count() >= $e['quantity']) {
                        DB::table('equipment_details')
                            ->whereIn('serial_id', $availableSerials)
                            ->update(['status' => 'rented']);

                        Log::info("[Webhook] Serials marked rented for equipment_id {$e['equipment_id']}", [
                            'serials' => $availableSerials->toArray(),
                        ]);
                    }
                }

                DB::commit();

                //Send FINAL PAID RECEIPT (customer)
                $account = Accounts::find($transaction->account_id);
                $customerEmail = $account?->email ?? '';
                if ($customerEmail) {
                    try {
                        Mail::to($customerEmail)->send(new CustomerPaidReceiptMail($order));
                    } catch (\Throwable $e) {
                        Log::warning('[paid receipt] customer email failed (new)', [
                            'order_id' => $order->order_id,
                            'err'      => $e->getMessage()
                        ]);
                    }
                }
                // (Optional) internal copy
                try {
                    Mail::to('roysohaib@hotmail.com')->send(new CustomerPaidReceiptMail($order));
                } catch (\Throwable $e) {}

                Cache::forget("order_session_$transactionId");

                return response('Order created', 200);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('[Webhook] Order creation failed', ['error' => $e->getMessage()]);
                return response('Order creation failed', 500);
            }
        }

        return response('Webhook event ignored', 200);
    } catch (\Exception $e) {
        Log::error('[Webhook] constructEvent error: '.$e->getMessage());
        return response('Webhook error', 400);
    }
}

public function getOrderIdFromSession($sessionId)
{
    require_once base_path('stripe-php-17.3.0/init.php');
    \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

    try {
        $session  = \Stripe\Checkout\Session::retrieve($sessionId);
        $metadata = $session->metadata ? $session->metadata->toArray() : [];

        //If this was an existing-order checkout, just return that order id
        if (!empty($metadata['existing_order_id'])) {
            return response()->json(['order_id' => (int) $metadata['existing_order_id']]);
        }

        //New-order flow: look up by transaction_id
        $transactionId = $metadata['transaction_id'] ?? null;
        if (!$transactionId) {
            return response()->json(['error' => 'Missing transaction ID'], 404);
        }

        $order = \App\Models\Orders::where('transaction_id', $transactionId)->first();
        if ($order) {
            return response()->json(['order_id' => $order->order_id]);
        }

        return response()->json(['error' => 'Order not found'], 404);
    } catch (\Exception $e) {
        \Log::error('[getOrderIdFromSession] '.$e->getMessage());
        return response()->json(['error' => 'Session lookup failed'], 500);
    }
}

   public function createCheckoutForExistingOrder(Request $request, Orders $order)
    {
        //Determine caller identity (prefer Sanctum user, fall back to explicit account_id)
        $accountId = optional($request->user())->account_id
            ?? optional($request->user())->id
            ?? (int) $request->input('account_id')
            ?? (int) $request->query('account_id');

        if (!$accountId) {
            Log::warning('[checkout-existing] unauthenticated');
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        //Ownership check
        if ((int)$order->account_id !== (int)$accountId) {
            Log::warning('[checkout-existing] forbidden - order does not belong to account', [
                'order_id' => $order->order_id,
                'order_account_id' => $order->account_id,
                'caller_account_id' => $accountId,
            ]);
            return response()->json(['error' => 'Forbidden'], 403);
        }

        //Paid guard
        if (strtolower((string)($order->payment_status ?? '')) === 'paid') {
            return response()->json(['error' => 'Order already paid'], 422);
        }

        //Stripe session
        require_once base_path('stripe-php-17.3.0/init.php');
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        $frontend = rtrim(env('FRONTEND_URL', config('app.frontend_url', '')), '/');
        $successUrl = $frontend ? $frontend . '/customer-portal?paid=1' : 'https://example.com/success';
        $cancelUrl  = $frontend ? $frontend . '/customer-portal?cancel=1' : 'https://example.com/cancel';

        $amountCents = (int) round(($order->total_amount ?? 0) * 100);

        $account = Accounts::find($order->account_id);
        $customerEmail = $account?->email;

        try {
            $session = \Stripe\Checkout\Session::create([
                'mode' => 'payment',
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'quantity' => 1,
                    'price_data' => [
                        'currency' => 'cad',
                        'unit_amount' => $amountCents,
                        'product_data' => [
                            'name' => 'Order #' . $order->order_id,
                            'description' => 'Eurofins EnviroWorks payment',
                        ],
                    ],
                ]],
                'success_url' => $successUrl,
                'cancel_url'  => $cancelUrl,
                'metadata' => [
                    'existing_order_id' => (string) $order->order_id,
                    'transaction_id'    => (string) ($order->transaction_id ?? ''),
                    'account_id'        => (string) $accountId,
                ],
                'client_reference_id' => (string) $order->order_id,
                'customer_email' => $customerEmail,
            ]);

            Log::info('[checkout-existing] session created', [
                'order_id' => $order->order_id,
                'session_id' => $session->id,
            ]);

            return response()->json(['id' => $session->id, 'url' => $session->url]);
        } catch (\Throwable $e) {
            Log::error('[checkout-existing] stripe error: '.$e->getMessage(), [
                'order_id' => $order->order_id,
            ]);
            return response()->json(['error' => 'Stripe error creating session'], 500);
        }
    }
}