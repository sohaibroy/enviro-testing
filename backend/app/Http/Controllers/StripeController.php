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
  'transaction_id' => $transactionId,
  'analytes' => json_encode($request->input('analytes', [])),
  'equipment' => json_encode($request->input('equipment', [])),
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

    $payload = $request->getContent();
    $sig_header = $request->server('HTTP_STRIPE_SIGNATURE');
    $secret = env('STRIPE_WEBHOOK_SECRET');

    try {
        $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $secret);
        $eventType = $event->type;

        if ($eventType === 'checkout.session.completed') {
            $session = $event->data->object;

            if ($session->payment_status !== 'paid') {

                return response('Payment not completed', 200);
            }

            $metadata = $session->metadata->toArray();
            $transactionId = $metadata['transaction_id'] ?? null;

            if (!$transactionId) {

                return response('Missing transaction_id', 400);
            }

            $subtotal = $session->amount_subtotal / 100;
            $gst = round($subtotal * 0.05, 2);
            $total = $session->amount_total / 100;

            $existingOrder = Orders::where('transaction_id', $transactionId)->first();
            if ($existingOrder) {
                $existingOrder->update([
                    'subtotal' => $subtotal,
                    'gst' => $gst,
                    'total_amount' => $total,
                    'payment_status' => 'paid',
                    'updated_at' => now(),
                ]);

                return response('Order updated', 200);
            }

            $transaction = Transactions::where('transaction_id', $transactionId)->first();
            if (!$transaction) {

                return response('Transaction not found', 404);
            }

            $analytes = json_decode($metadata['analytes'] ?? '[]', true);
            $equipment = json_decode($metadata['equipment'] ?? '[]', true);

            DB::beginTransaction();
            try {
                $order = Orders::create([
                    'account_id' => $transaction->account_id,
                    'transaction_id' => $transactionId,
                    'order_date' => now(),
                    'subtotal' => $subtotal,
                    'gst' => $gst,
                    'total_amount' => $total,
                    'payment_status' => 'paid',
                    'payment_method' => 'Credit Card',
                    'status' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                foreach ($analytes as $a) {
                    if (!isset($a['analyte']) || !isset($a['method'])) {
                        continue;
                    }

                    $analyte = \App\Models\Analytes::where('analyte_name', $a['analyte'])->first();
                    $method = \App\Models\Methods::where('method_name', $a['method'])->first();

                    if (!$analyte || !$method) {
                        Log::error('[Webhook] Could not resolve analyte or method by name:', [
                            'analyte' => $a['analyte'],
                            'method' => $a['method'],
                        ]);
                        continue;
                    }

                    OrderDetails::create([
                        'order_id' => $order->order_id,
                        'analyte_id' => $analyte->analyte_id,
                        'method_id' => $method->method_id,
                        'turn_around_id' => $a['turnaround_time_id'] ?? ($a['turnaround']['id'] ?? null),
                        'price' => $a['price'],
                        'required_pumps' => $a['required_pumps'] ?? null,
    'required_media' => $a['required_media'] ?? null,
    'customer_comment' => $a['customer_comment'] ?? null,
                    ]);
                }

                foreach ($equipment as $e) {
                    if (!isset($e['equipment_id'])) {
                        continue;
                    }

                        $equipmentMeta = \App\Models\Equipment::with('equipmentType')->find($e['equipment_id']);

    if (!$equipmentMeta) {

        continue;
    }

                    OrderEquipment::create([
        'order_id' => $order->order_id,
        'equipment_id' => $e['equipment_id'],
        'equipment_name' => $equipmentMeta->equipment_name,
        'category' => $equipmentMeta->equipmentType->equipment_type_name ?? 'Unknown',
        'start_date' => $e['start_date'],
        'return_date' => $e['return_date'],
        'quantity' => $e['quantity'],
        'daily_cost' => $e['daily_cost'],
    ]);

    // Update status of rented serials
$availableSerials = DB::table('equipment_details')
    ->where('equipment_id', $e['equipment_id'])
    ->where('status', 'available')
    ->limit($e['quantity'])
    ->pluck('serial_id');

if ($availableSerials->count() < $e['quantity']) {

} else {
    DB::table('equipment_details')
        ->whereIn('serial_id', $availableSerials)
        ->update(['status' => 'rented']);

    Log::info("[Webhook] Serial(s) marked rented for equipment_id {$e['equipment_id']}: " . implode(',', $availableSerials->toArray()));
}

}

                DB::commit();
                //I AM ADDING THIS MAIL LINE
                // Get customer email (you can also get it from session metadata if passed)
$account = \App\Models\Accounts::find($transaction->account_id);
$customerEmail = $account?->email ?? '';

//Send confirmation to customer
if ($customerEmail) {
    Mail::to($customerEmail)->send(new CustomerOrderConfirmationMail($order));
}

//Send notification to company
Mail::to('roysohaib@hotmail.com')->send(new CompanyOrderNotificationMail($order, $customerEmail));

Cache::forget("order_session_$transactionId");
return response('Order created', 200);
//ENDING THE MAIL LINE
                Cache::forget("order_session_$transactionId");

                return response('Order created', 200);
            } catch (\Exception $e) {
                DB::rollBack();

                return response('Order creation failed', 500);
            }
        }

        return response('Webhook event ignored', 200);
    } catch (\Exception $e) {

        return response('Webhook error', 400);
    }
}

    public function getOrderIdFromSession($sessionId)
    {
        require_once base_path('stripe-php-17.3.0/init.php');
        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            $session = Session::retrieve($sessionId);
            $metadata = $session->metadata->toArray();
            $transactionId = $metadata['transaction_id'] ?? null;

            if (!$transactionId) {
                return response()->json(['error' => 'Missing transaction ID'], 404);
            }

            $order = Orders::where('transaction_id', $transactionId)->first();
            if ($order) {
                return response()->json(['order_id' => $order->order_id]);
            } else {
                return response()->json(['error' => 'Order not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Session lookup failed'], 500);
        }
    }
}