<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Orders;
use App\Models\OrderDetails;
use App\Models\Analytes;
use App\Models\Methods;
use App\Models\Accounts;
use App\Models\Companies;
use App\Mail\EmailOrder;
use App\Models\TurnAroundTime;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use App\Models\OrderEquipment;

class OrdersController extends Controller
{
    // Shows all records in the orders table
    public function index()
    {
        $orders = Orders::all();

        return response()->json($orders);
    }

public function createOrder(Request $request)
{
    \Log::info('[DEBUG] createOrder() route hit');
    $data = $request->all();

    $validator = Validator::make($data, [
        'order.transaction_id' => 'required|integer|exists:transactions,transaction_id',
        'order.subtotal' => 'required|numeric',
        'order.gst' => 'required|numeric',
        'order.total_amount' => 'required|numeric',

        'order_details.*.turn_around_id' => 'required|integer|exists:turn_around_times,turn_around_id',
        'order_details.*.price' => 'required|numeric',
        'order_details.*.required_quantity' => 'required|integer',
        'order_details.*.required_pumps' => 'nullable|integer',
        'order_details.*.required_media' => 'nullable|string',
        'order_details.*.customer_comment' => 'nullable|string',

        'rental_items.*.equipment_name' => 'required|string|max:255',
        'rental_items.*.category' => 'required|string|max:255',
        'rental_items.*.start_date' => 'required|date',
        'rental_items.*.return_date' => 'required|date',
        'rental_items.*.quantity' => 'required|integer|min:1',
        'rental_items.*.daily_cost' => 'required|numeric|min:0',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
        \DB::beginTransaction();

        $order = new Orders();
        $order->transaction_id = $data['order']['transaction_id'];
        $order->subtotal = $data['order']['subtotal'];
        $order->gst = $data['order']['gst'];
        $order->total_amount = $data['order']['total_amount'];
        $order->order_date = now();
        $order->status = 0;
        $order->save();

        $order_id = $order->order_id;

        // Save analyte-based order_details
        if (!empty($data['order_details'])) {
            foreach ($data['order_details'] as $detail) {
                DB::table('order_details')->insert([
                    'order_id' => $order_id,
                    'turn_around_id' => $detail['turn_around_id'],
                    'price' => $detail['price'],
                    'required_quantity' => $detail['required_quantity'],
                    'required_pumps' => $detail['required_pumps'] ?? null,
                    'required_media' => $detail['required_media'] ?? null,
                    'customer_comment' => $detail['customer_comment'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Save equipment rental items
        if (!empty($data['rental_items'])) {
            foreach ($data['rental_items'] as $item) {
                // 1. Save the rental record
                OrderEquipment::create([
                    'order_id' => $order_id,
                    'equipment_name' => $item['equipment_name'],
                    'category' => $item['category'],
                    'start_date' => $item['start_date'],
                    'return_date' => $item['return_date'],
                    'quantity' => $item['quantity'],
                    'daily_cost' => $item['daily_cost'],
                ]);

                // 2. Update status of rented serials
                $equipmentId = DB::table('equipment')
                    ->where('equipment_name', $item['equipment_name'])
                    ->value('equipment_id');

                if ($equipmentId) {
                    $availableSerials = DB::table('equipment_details')
                        ->where('equipment_id', $equipmentId)
                        ->where('status', 'available')
                        ->limit($item['quantity'])
                        ->pluck('serial_id');

                    if ($availableSerials->count() < $item['quantity']) {
                        throw new \Exception("Not enough available units for equipment: {$item['equipment_name']}");
                    }

                    DB::table('equipment_details')
                        ->whereIn('serial_id', $availableSerials)
                        ->update(['status' => 'rented']);
                } else {
                    \Log::warning("[WARN] No equipment_id found for equipment_name: {$item['equipment_name']}");
                }
            }
        }

        \DB::commit();

        return response()->json([
            'message' => 'Order created successfully',
            'order_id' => $order_id,
        ], 201);

    } catch (\Exception $e) {
        \DB::rollback();
        \Log::error('[ERROR] createOrder() failed', ['error' => $e->getMessage()]);
        return response()->json([
            'message' => 'Failed to create order',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    // Search for a specific order by order_id
    // search by company name and date
  public function getOrderByOrderId($order_id)
{
    if (!is_numeric($order_id) || $order_id < 1) {
        return response()->json(['message' => 'Please enter a valid order id'], 400);
    }

    $order = Orders::with('equipmentItems')->find($order_id);

    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    return response()->json([
        'order_id' => $order->order_id,
        'transaction_id' => $order->transaction_id,
        'account_id' => $order->account_id,
        'order_date' => $order->order_date,
        'subtotal' => $order->subtotal,
        'gst' => $order->gst,
        'total_amount' => $order->total_amount,
        'status' => $order->status,
'status_label' => match ($order->status) {
    0 => 'Not Started',
    1 => 'In Process',
    2 => 'Completed',
    default => 'Unknown',
},
        'created_at' => $order->created_at,
        'updated_at' => $order->updated_at,

        // Include all related rental equipment
        'equipment_items' => $order->equipmentItems,
    ]);
}

    public function searchOrderTool($seachValue)
    {

        $searchTerm = $seachValue;

        $searchResults = DB::table('orders')
        ->join('accounts', 'accounts.account_id', '=', 'orders.account_id')
        ->join('companies', 'companies.company_id', '=', 'accounts.company_id')
        ->select('orders.order_id',
            'orders.order_date',
            'orders.total_amount',
            'orders.subtotal',
            'orders.gst',
            'orders.is_active',
            'accounts.account_id',
            'accounts.company_id',
            'accounts.first_name',
            'accounts.last_name',
            'accounts.email',
            'accounts.phone_number',
            'companies.company_id',
            'companies.company_name',
            'companies.address',
            'companies.company_phone')
        ->where(function($query) use ($searchTerm) {
            $query->where('orders.order_date', 'like', "%$searchTerm%")
                ->orWhere('orders.order_id', $searchTerm)
                ->orWhere('companies.company_name', 'like', "%$searchTerm%");
        })
        ->get();
        if ($searchResults->isEmpty()) {
            return response()->json(['message' => "No order found"], 404);
        } else {
            return response()->json(['message'=>$searchResults], 200);
        }


    }
    //Update an existing order
    public function updateOrders(Request $request, $order_id)
{
    $user = Auth::user();
    if (strpos((string) $user, 'admin') === false) {
        return response()->json(['message' => 'You are not authorized to view this page'], 401);
    }

    if (!is_numeric($order_id) || $order_id < 1) {
        return response()->json(['message' => 'Please enter a valid order id'], 400);
    }

    $validator = Validator::make($request->all(), [
        'status'           => 'required|in:0,1,2',
        'po_number'        => 'nullable|string|max:100',
        'payment_status'   => 'nullable|in:pending,paid',
        'payment_method'   => 'nullable|string|max:32',
        'payment_reference'=> 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 400);
    }

    //Load current order so we can detect transitions
    /** @var \App\Models\Orders|null $order */
    $order = \App\Models\Orders::find($order_id);
    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    $prevPaymentStatus = strtolower((string) ($order->payment_status ?? ''));
    $markingPaid       = ($request->input('payment_status') === 'paid');
    $firstTimePaid     = $markingPaid && ($prevPaymentStatus !== 'paid');

    //Build update payload
    $payload = [
        'status' => (int) $request->input('status'),
        'updated_at' => now(),
    ];

    if ($request->filled('po_number')) {
        $payload['po_number'] = $request->input('po_number');
    }

    if ($markingPaid) {
        $payload['payment_status']      = 'paid';
        $payload['payment_method']      = $request->input('payment_method', 'EFT');
        $payload['payment_received_at'] = now();
        if ($request->filled('payment_reference')) {
            $payload['payment_reference'] = $request->input('payment_reference');
        }
    } elseif ($request->input('payment_status') === 'pending') {
        $payload['payment_status'] = 'pending';
    }

    try {
        \DB::beginTransaction();

        //Update order row
        \DB::table('orders')->where('order_id', $order_id)->update($payload);

        //Refresh the model with new values
        $order->refresh();

        //If transitioning to PAID now, create transaction (if missing) + payment row
        if ($firstTimePaid) {
            //Ensure a transaction exists
            if (empty($order->transaction_id)) {
                $txnId = \DB::table('transactions')->insertGetId([
                    'account_id'   => $order->account_id,
                    'subtotal'     => $order->subtotal,
                    'gst'          => $order->gst,
                    'total_amount' => $order->total_amount,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);

                $order->transaction_id = $txnId;
                \DB::table('orders')->where('order_id', $order_id)->update([
                    'transaction_id' => $txnId,
                    'updated_at'     => now(),
                ]);
            }

            //Record a payment
            \DB::table('payments')->insert([
                'transaction_id'    => $order->transaction_id,
                'payment_method'    => strtolower($order->payment_method ?? 'eft'), // e.g., eft, wire, cheque
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

        \DB::commit();
    } catch (\Throwable $e) {
        \DB::rollBack();
        \Log::error('[updateOrders] failed to update order', [
            'order_id' => $order_id,
            'error'    => $e->getMessage(),
        ]);
        return response()->json(['message' => 'Failed to update order', 'error' => $e->getMessage()], 500);
    }

    //Send emails only on first transition to paid
    if ($firstTimePaid) {
        try {
            $account = \App\Models\Accounts::find($order->account_id);
            $customerEmail = $account?->email;

            if ($customerEmail) {
                \Log::info('[admin-paid] Sending CustomerPaidReceiptMail', [
                    'order_id' => $order->order_id,
                    'to'       => $customerEmail,
                ]);
                \Mail::to($customerEmail)->send(new \App\Mail\CustomerPaidReceiptMail($order));
            } else {
                \Log::warning('[admin-paid] No customer email on account', [
                    'order_id'   => $order->order_id,
                    'account_id' => $order->account_id,
                ]);
            }

            //Internal copy
            try {
                \Mail::to('roysohaib@hotmail.com')->send(new \App\Mail\CustomerPaidReceiptMail($order));
            } catch (\Throwable $e) {
                \Log::warning('[admin-paid] internal copy failed', ['order_id' => $order->order_id, 'err' => $e->getMessage()]);
            }
        } catch (\Throwable $e) {
            \Log::error('[admin-paid] sending receipt failed', [
                'order_id' => $order->order_id,
                'error'    => $e->getMessage(),
            ]);
        }
    }

    return response()->json(['message' => 'Order updated successfully'], 200);
}


    //Get the order with its details passing order id
public function getOrderWithDetails($order_id)
{
    if (!is_numeric($order_id) || $order_id < 1) {
        return response()->json(['message' => 'Invalid order ID'], 400);
    }

    $order = DB::table('orders')->where('order_id', $order_id)->first();
    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    $equipment = DB::table('order_equipment')
        ->select('equipment_name', 'category', 'start_date', 'return_date', 'quantity', 'daily_cost')
        ->where('order_id', $order_id)
        ->get();

    //Resolve method/analyte via od.method_id OR t.method_id
    $details = DB::table('order_details as od')
        ->leftJoin('turn_around_times as t', 'od.turn_around_id', '=', 't.turn_around_id')
        ->leftJoin('methods as m', function ($join) {
            $join->on('m.method_id', '=', 'od.method_id')
                 ->orOn('m.method_id', '=', 't.method_id');
        })
        ->leftJoin('analytes as a', 'a.analyte_id', '=', 'm.analyte_id')
        ->where('od.order_id', $order_id)
        ->get([
            'od.price',
            'od.required_quantity',
            'od.required_pumps',
            'od.required_media',
            'od.customer_comment',
            't.turnaround_time',
            'm.method_name',
            'a.analyte_name',
            //extra aliases in case the frontend expects these keys:
            DB::raw('m.method_name as method'),
            DB::raw('a.analyte_name as analyte'),
        ]);

    return response()->json([
        'order_id'        => $order->order_id,
        'order_date'      => $order->order_date,
        'subtotal'        => $order->subtotal,
        'gst'             => $order->gst,
        'total_amount'    => $order->total_amount,
        'payment_status'  => $order->payment_status ?? 'pending',
        'details'         => $details,
        'equipment_items' => $equipment,
    ]);
}

// public function createPoOrder(Request $request)
// {
//     $user = \Auth::user();
//     $accountId = $user?->account_id ?? $user?->id;

//     //Validate core payload
//     $data = $request->validate([
//         'order.subtotal'        => 'required|numeric|min:0',
//         'order.gst'             => 'required|numeric|min:0',
//         'order.total_amount'    => 'required|numeric|min:0',

//         'order_details'                         => 'nullable|array',
//         'order_details.*.turn_around_id'        => 'required|integer|exists:turn_around_times,turn_around_id',
//         'order_details.*.price'                 => 'required|numeric|min:0',
//         'order_details.*.required_quantity'     => 'required|integer|min:1',
//         'order_details.*.required_pumps'        => 'nullable|integer|min:0',
//         'order_details.*.required_media'        => 'nullable|string',
//         'order_details.*.customer_comment'      => 'nullable|string|max:10000',

        
//         'order_details.*.method_id'             => 'nullable|integer|exists:methods,method_id',
//         'order_details.*.analyte_id'            => 'nullable|integer|exists:analytes,analyte_id',
//         'order_details.*.method_name'           => 'nullable|string|max:255',
//         'order_details.*.analyte_name'          => 'nullable|string|max:255',

//         'rental_items'                          => 'nullable|array',
//         'rental_items.*.equipment_name'         => 'required|string|max:255',
//         'rental_items.*.category'               => 'required|string|max:255',
//         'rental_items.*.start_date'             => 'required|date',
//         'rental_items.*.return_date'            => 'required|date|after_or_equal:rental_items.*.start_date',
//         'rental_items.*.quantity'               => 'required|integer|min:1',
//         'rental_items.*.daily_cost'             => 'required|numeric|min:0',

//         'po_number'                              => 'nullable|string|max:100',
//     ]);

//     try {
//         \DB::beginTransaction();

//         //Create the order (orders table has timestamps disabled -> set manually)
//         $o = new \App\Models\Orders();
//         $o->account_id      = $accountId;
//         $o->transaction_id  = null;
//         $o->subtotal        = $data['order']['subtotal'];
//         $o->gst             = $data['order']['gst'];
//         $o->total_amount    = $data['order']['total_amount'];
//         $o->order_date      = now();
//         $o->status          = 0;                 // Not Started
//         $o->payment_status  = 'pending';
//         $o->payment_method  = 'PO';
//         $o->po_number       = $data['po_number'] ?? null;
//         $o->created_at      = now();
//         $o->updated_at      = now();
//         $o->save();

//         $orderId = $o->order_id;

//         //Insert order_details (resolve analyte/method by id or by name if provided)
//         foreach (($data['order_details'] ?? []) as $d) {
//             $methodId  = $d['method_id']   ?? null;
//             $analyteId = $d['analyte_id']  ?? null;

//             if (!$methodId && !empty($d['method_name'])) {
//                 $m = \App\Models\Methods::where('method_name', $d['method_name'])->first();
//                 $methodId = $m?->method_id;
//             }
//             if (!$analyteId && !empty($d['analyte_name'])) {
//                 $a = \App\Models\Analytes::where('analyte_name', $d['analyte_name'])->first();
//                 $analyteId = $a?->analyte_id;
//             }

//             \DB::table('order_details')->insert([
//                 'order_id'          => $orderId,
//                 'method_id'         => $methodId,     // may be null if not provided/resolved
//                 'analyte_id'        => $analyteId,    // may be null if not provided/resolved
//                 'turn_around_id'    => $d['turn_around_id'],
//                 'price'             => $d['price'],
//                 'required_quantity' => $d['required_quantity'],
//                 'required_pumps'    => $d['required_pumps'] ?? null,
//                 'required_media'    => $d['required_media'] ?? null,
//                 'customer_comment'  => $d['customer_comment'] ?? null,
//                 'created_at'        => now(),
//                 'updated_at'        => now(),
//             ]);
//         }

//         //Insert equipment and reserve serials immediately for PO
//         foreach (($data['rental_items'] ?? []) as $item) {
//             \App\Models\OrderEquipment::create([
//                 'order_id'       => $orderId,
//                 'equipment_name' => $item['equipment_name'],
//                 'category'       => $item['category'],
//                 'start_date'     => $item['start_date'],
//                 'return_date'    => $item['return_date'],
//                 'quantity'       => $item['quantity'],
//                 'daily_cost'     => $item['daily_cost'],
//                 'created_at'     => now(),
//                 'updated_at'     => now(),
//             ]);

//             //Reserve units
//             $equipmentId = \DB::table('equipment')
//                 ->where('equipment_name', $item['equipment_name'])
//                 ->value('equipment_id');

//             if ($equipmentId) {
//                 $availableSerials = \DB::table('equipment_details')
//                     ->where('equipment_id', $equipmentId)
//                     ->where('status', 'available')
//                     ->limit($item['quantity'])
//                     ->pluck('serial_id');

//                 if ($availableSerials->count() < $item['quantity']) {
//                     throw new \Exception("Not enough available units for equipment: {$item['equipment_name']}");
//                 }

//                 \DB::table('equipment_details')
//                     ->whereIn('serial_id', $availableSerials)
//                     ->update(['status' => 'rented']);

//                 \Log::info("[PO] Reserved serials for equipment_id {$equipmentId}: " . implode(',', $availableSerials->toArray()));
//             } else {
//                 \Log::warning("[PO] No equipment_id found for equipment_name: {$item['equipment_name']}");
//             }
//         }

//         //Eager load for email templates
//         $o->load([
//             'orderDetails.method.analyte',
//             'orderDetails.turnAround',     // if you want turnaround label
//             'equipmentItems',
//             // Optional: 'account.company'
//         ]);

//         \DB::commit();

//         // Send customer "pending" confirmation
// $customerEmail = \DB::table('accounts')->where('account_id', $o->account_id)->value('email');
// if ($customerEmail) {
//     try {
//         \Mail::to($customerEmail)->send(new \App\Mail\CustomerPoOrderConfirmationMail($o, $customerEmail));
//     } catch (\Throwable $mailErr) {
//         \Log::warning('[PO email] Failed to send customer PO email', ['error' => $mailErr->getMessage()]);
//     }
// }

// // Send company notification (paid/pending)
// try {
//     \Mail::to('roysohaib@hotmail.com')->send(new \App\Mail\CompanyOrderNotificationMail($o, $customerEmail));
// } catch (\Throwable $mailErr) {
//     \Log::warning('[PO email] Failed to send company notification', ['error' => $mailErr->getMessage()]);
// }

// return response()->json(['message' => 'PO order created', 'order_id' => $orderId], 201);

//     } catch (\Throwable $e) {
//         \DB::rollBack();
//         \Log::error('[createPoOrder] '.$e->getMessage());
//         return response()->json(['error' => 'Failed to create PO order'], 500);
//     }
// }

public function createPoOrder(Request $request)
{
    $user = \Auth::user();
    $accountId = $user?->account_id ?? $user?->id ?? $request->input('account_id');

    if (!$accountId) {
        return response()->json(['error' => 'Unauthenticated: account_id required'], 401);
    }

    $data = $request->validate([
        'order.subtotal'        => 'required|numeric|min:0',
        'order.gst'             => 'required|numeric|min:0',
        'order.total_amount'    => 'required|numeric|min:0',

        'order_details'                         => 'nullable|array',
        'order_details.*.turn_around_id'        => 'required|integer|exists:turn_around_times,turn_around_id',
        'order_details.*.price'                 => 'required|numeric|min:0',
        'order_details.*.required_quantity'     => 'required|integer|min:1',
        'order_details.*.required_pumps'        => 'nullable|integer|min:0',
        'order_details.*.required_media'        => 'nullable|string',
        'order_details.*.customer_comment'      => 'nullable|string|max:10000',

        'order_details.*.method_id'             => 'nullable|integer|exists:methods,method_id',
        'order_details.*.analyte_id'            => 'nullable|integer|exists:analytes,analyte_id',
        'order_details.*.method_name'           => 'nullable|string|max:255',
        'order_details.*.analyte_name'          => 'nullable|string|max:255',

        'rental_items'                          => 'nullable|array',
        'rental_items.*.equipment_name'         => 'required|string|max:255',
        'rental_items.*.category'               => 'required|string|max:255',
        'rental_items.*.start_date'             => 'required|date',
        'rental_items.*.return_date'            => 'required|date|after_or_equal:rental_items.*.start_date',
        'rental_items.*.quantity'               => 'required|integer|min:1',
        'rental_items.*.daily_cost'             => 'required|numeric|min:0',

        'po_number'                              => 'nullable|string|max:100',
        'account_id'                             => 'nullable|integer',
    ]);

    try {
        \DB::beginTransaction();

        //Create transaction first
        $txnId = \DB::table('transactions')->insertGetId([
            'account_id'   => $accountId,
            'subtotal'     => $data['order']['subtotal'],
            'gst'          => $data['order']['gst'],
            'total_amount' => $data['order']['total_amount'],
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        //Create order
        $o = new \App\Models\Orders();
        $o->account_id      = $accountId;
        $o->transaction_id  = $txnId;
        $o->subtotal        = $data['order']['subtotal'];
        $o->gst             = $data['order']['gst'];
        $o->total_amount    = $data['order']['total_amount'];
        $o->order_date      = now();
        $o->status          = 0;
        $o->payment_status  = 'pending';
        $o->payment_method  = 'PO';
        $o->po_number       = $data['po_number'] ?? null;
        $o->created_at      = now();
        $o->updated_at      = now();
        $o->save();

        $orderId = $o->order_id;

        //Details
        foreach (($data['order_details'] ?? []) as $d) {
            $methodId  = $d['method_id']  ?? null;
            $analyteId = $d['analyte_id'] ?? null;

            if (!$methodId && !empty($d['method_name'])) {
                $m = \App\Models\Methods::where('method_name', $d['method_name'])->first();
                $methodId = $m?->method_id;
            }
            if (!$analyteId && !empty($d['analyte_name'])) {
                $a = \App\Models\Analytes::where('analyte_name', $d['analyte_name'])->first();
                $analyteId = $a?->analyte_id;
            }

            \DB::table('order_details')->insert([
                'order_id'          => $orderId,
                'method_id'         => $methodId,
                'analyte_id'        => $analyteId,
                'turn_around_id'    => $d['turn_around_id'],
                'price'             => $d['price'],
                'required_quantity' => $d['required_quantity'],
                'required_pumps'    => $d['required_pumps'] ?? null,
                'required_media'    => $d['required_media'] ?? null,
                'customer_comment'  => $d['customer_comment'] ?? null,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }

        //Equipment + reserve serials
        foreach (($data['rental_items'] ?? []) as $item) {
            \App\Models\OrderEquipment::create([
                'order_id'       => $orderId,
                'equipment_name' => $item['equipment_name'],
                'category'       => $item['category'],
                'start_date'     => $item['start_date'],
                'return_date'    => $item['return_date'],
                'quantity'       => $item['quantity'],
                'daily_cost'     => $item['daily_cost'],
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            $equipmentId = \DB::table('equipment')
                ->where('equipment_name', $item['equipment_name'])
                ->value('equipment_id');

            if ($equipmentId) {
                $availableSerials = \DB::table('equipment_details')
                    ->where('equipment_id', $equipmentId)
                    ->where('status', 'available')
                    ->limit($item['quantity'])
                    ->pluck('serial_id');

                if ($availableSerials->count() < $item['quantity']) {
                    throw new \Exception("Not enough available units for equipment: {$item['equipment_name']}");
                }

                \DB::table('equipment_details')
                    ->whereIn('serial_id', $availableSerials)
                    ->update(['status' => 'rented']);
            }
        }

        //Eager-load for email templates
        $o->load(['orderDetails.method.analyte', 'orderDetails.turnAround', 'equipmentItems', 'account.company']);

        \DB::commit();

        //EMAILS
        $customerEmail = \DB::table('accounts')->where('account_id', $accountId)->value('email') ?: '';
        $opsEmail = env('OPS_NOTIF_EMAIL', 'roysohaib@hotmail.com');

        //Customer email (always BCC ops so they at least get this)
        try {
            if ($customerEmail) {
                \Mail::to($customerEmail)
                    ->bcc($opsEmail)
                    ->send(new \App\Mail\CustomerPoOrderConfirmationMail($o));
                \Log::info('[PO email] Customer mail sent (with BCC to ops)', [
                    'order_id' => $o->order_id,
                    'to'       => $customerEmail,
                    'bcc'      => $opsEmail,
                ]);
            }
        } catch (\Throwable $mailErr) {
            \Log::warning('[PO email] Customer mail failed', [
                'order_id' => $o->order_id,
                'err'      => $mailErr->getMessage(),
            ]);
        }

        //Dedicated company notification
        try {
            \Mail::to($opsEmail)->send(new \App\Mail\CompanyOrderNotificationMail($o, $customerEmail));
            \Log::info('[PO email] Company notification sent', [
                'order_id' => $o->order_id,
                'to'       => $opsEmail,
            ]);
        } catch (\Throwable $mailErr) {
            \Log::warning('[PO email] Company notification failed', [
                'order_id' => $o->order_id,
                'err'      => $mailErr->getMessage(),
            ]);
        }

        return response()->json(['message' => 'PO order created', 'order_id' => $orderId], 201);

    } catch (\Throwable $e) {
        \DB::rollBack();
        \Log::error('[createPoOrder] '.$e->getMessage());
        return response()->json(['error' => 'Failed to create PO order'], 500);
    }
}


public function ExtremeOrderInfo()
{
    // Pull orders with account + company info using orders.account_id
    $rows = DB::table('orders as o')
        ->leftJoin('accounts as a', 'a.account_id', '=', 'o.account_id')
        ->leftJoin('companies as c', 'c.company_id', '=', 'a.company_id')
        ->select([
            'o.order_id',
            'o.order_date',
            'o.subtotal',
            'o.gst',
            'o.total_amount',
            'o.status',
            'o.payment_status',
            'o.payment_method',
            'o.po_number',
            'o.transaction_id',
            DB::raw("CASE
                WHEN o.status = 0 THEN 'Not Started'
                WHEN o.status = 1 THEN 'In Process'
                WHEN o.status = 2 THEN 'Completed'
                ELSE 'Unknown'
            END AS status_label"),
            'a.account_id',
            'a.first_name',
            'a.last_name',
            'a.email',
            'a.phone_number',
            'c.company_id',
            'c.company_name',
            'c.address',
            'c.company_phone',
        ])
        ->orderByDesc('o.order_date')
        ->get();

    return response()->json($rows);
}


}
