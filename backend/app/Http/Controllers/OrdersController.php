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

    // public function createOrder($order)
    // {
    //     // Validate the incoming JSON data
    //     $validator = Validator::make($order, [
    //         'order.transaction_id' => 'required|integer|min:1|max:11',
    //         'order.subtotal' => 'required|numeric',
    //         'order_details.*.turn_around_id' => 'required|integer',
    //         'order_details.*.price' => 'required|numeric',
    //         'order_details.*.required_quantity' => 'required|integer|min:1',
    //         'order_details.*.required_pumps' => 'nullable|integer|max:11',
    //         'order_details.*.required_media' => 'nullable|integer|max:11',
    //         'order_details.*.customer_comment' => 'nullable|string|max:255',
    //     ]);

    //     // Check if validation fails
    //     if ($validator->fails()) {
    //         throw new Exception(json_encode($validator->errors()), 422);
    //     }

    //     try {
    //         // Begin a database transaction
    //         \DB::beginTransaction();

    //         // Create and save the order header
    //         $orderRecord = new Orders();
    //         $orderRecord->transaction_id = $order['transaction_id'];
    //         $orderRecord->total_amount = $order['total_amount'];
    //         $orderRecord->subtotal = $order['subtotal'];
    //         $orderRecord->save();

    //         // Retrieve the order_id after saving the order header
    //         $order_id = $orderRecord->order_id;

    //         // Create and save the order details
    //         foreach ($request->input('order_details') as $detail) {
    //             $orderDetail = new OrderDetails();
    //             $orderDetail->order_id = $order_id; // Assign the order ID
    //             $orderDetail->turn_around_id = $detail['turn_around_id'];
    //             $orderDetail->price = $detail['price'];
    //             $orderDetail->quantity = $detail['required_quantity'];
    //             $orderDetail->quantity_pumps = $detail['required_pumps'];
    //             $orderDetail->quantity_media = $detail['required_media'];
    //             $orderDetail->comments = $detail['customer_comment'];
    //             $orderDetail->save();
    //         }

    //         // Commit the transaction
    //         \DB::commit();

    //         // Return a success response
    //         return $orderRecord;
    //     } catch (\Exception $e) {
    //         // Rollback the transaction if an exception occurs
    //         \DB::rollback();
    //         // Rethrow to be caught by createTransaction
    //         throw $e;
    //     }
    // }

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
        $order->is_active = 1;
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
        'is_active' => $order->is_active,
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
    // Update an existing order
    public function updateOrders(Request $request, $order_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        if(!is_numeric($order_id) || $order_id < 1){
            return response()->json(['message'=>'Please enter a valid order id'],400);
        }

        $validator = Validator::make($request->all(), [
            'is_active' => 'required|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $is_active = $request->input('is_active');

        $affectedRows = DB::table('orders')
            ->where('order_id', $order_id)
            ->update([
                'is_active' => $is_active
            ]);

        if ($affectedRows === 0) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(['message' => 'Order updated successfully'], 200);
    }


    public function ExtremeOrderInfo()
{
    //disabling auth check here until admin guard is set up

     $orders = DB::table('orders')
        ->join('transactions', 'orders.transaction_id', '=', 'transactions.transaction_id')
        ->join('accounts', 'accounts.account_id', '=', 'transactions.account_id')
        ->join('companies', 'companies.company_id', '=', 'accounts.company_id')
        ->select(
            'orders.order_id',
            'orders.order_date',
            'orders.subtotal',
            'orders.gst',
            'orders.total_amount',
            'orders.is_active',
            'accounts.first_name',
            'accounts.last_name',
            'accounts.email',
            'accounts.phone_number',
            'companies.company_id',
            'companies.company_name',
            'companies.address',
            'companies.company_phone'
        )
        ->get();

    return response()->json($orders);
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

    $details = DB::table('order_details as o')
        ->select(
            'o.price',
            'o.required_quantity',
            'o.required_pumps',
            'o.required_media',
            'o.customer_comment',
            't.turnaround_time',
            'm.method_name',
            'm.media',
            'a.analyte_name'
        )
        ->leftJoin('turn_around_times as t', 'o.turn_around_id', '=', 't.turn_around_id')
        ->leftJoin('methods as m', 't.method_id', '=', 'm.method_id')
        ->leftJoin('analytes as a', 'm.analyte_id', '=', 'a.analyte_id')
        ->where('o.order_id', $order_id)
        ->get();

    return response()->json([
        'order_id' => $order->order_id,
        'order_date' => $order->order_date,
        'subtotal' => $order->subtotal,
        'payment_status' => $order->payment_status ?? 'pending',
        'details' => $details,
        'equipment_items' => $equipment,
    ]);
}

    // NOTE: Commenting out since new Transactions rework should take care of this.
    // public function storeWalkinOrders(Request $request)
    // {
    //     // Validate the incoming JSON data
    //     $validator = Validator::make($request->all(), [
    //         'order_header.order_date' => 'required|date',
    //         'order_header.total_amount' => 'required|numeric',
    //         'order_header.subtotal' => 'required|numeric',
    //         'order_header.gst' => 'required|numeric',
    //         'order_details.*.turn_around_id' => 'required|integer',
    //         'order_details.*.price' => 'required|numeric',
    //         'order_details.*.required_quantity' => 'required|integer|min:1',
    //         'order_details.*.required_pumps' => 'nullable|integer|max:11',
    //         'order_details.*.required_media' => 'nullable|integer|max:11',
    //         'order_details.*.customer_comment' => 'nullable|string|max:255',
    //         'order_header.firstName' => 'required|string|max:255',
    //         'order_header.lastName' => 'required|string|max:255',
    //         'order_header.email' => 'required|email|max:255',
    //         'order_header.phoneNumber' => 'required|string|max:20',
    //     ]);
    //     // Check if validation fails
    //     if ($validator->fails()) {
    //         return response()->json(['message' => $validator->errors()], 422);
    //     }

    //     // Begin a database transaction
    //     \DB::beginTransaction();

    //     try {
    //         $accountID="";
    //         $account = null;
    //         // Check if the email already exists
    //         $existingAccount = Accounts::where('email', $request->input('order_header.email'))->first();
    //         if($existingAccount){
    //             $accountCompanyId =$existingAccount->company_id;
    //                 if($accountCompanyId !== 1){
    //                     return response()->json(['message'=>'Please log in to portal to make order'], 420);
    //             }
    //             $account = $existingAccount; // Assign existing account
    //             $accountID = $existingAccount->account_id;

    //         }
    //        else{
    //             // Create the new customer
    //             $account = new Accounts();
    //             $account->first_name = $request->input('order_header.firstName');
    //             $account->last_name = $request->input('order_header.lastName');
    //             $account->email = $request->input('order_header.email');
    //             $account->password = HASH::make($request->input('order_header.firstName') . $request->input('order_header.lastName') . 'EnviroWorks1');
    //             $account->phone_number = $request->input('order_header.phoneNumber');
    //             $account->company_id = 1;
    //             $account->is_active = 0; // default is put to zero they are walk in customer
    //             $account->save();

    //             // Retrieve the account ID after saving the account
    //             $accountID = $account->account_id;
    //         }

    //         // Create and save the order header
    //         $order = new Orders();
    //         $order->account_id = $accountID;
    //         $order->order_date = $request->input('order_header.order_date');
    //         $order->total_amount = $request->input('order_header.total_amount');
    //         $order->gst = $request->input('order_header.gst');
    //         $order->subtotal = $request->input('order_header.subtotal');
    //         $order->is_active = 1;
    //         $order->save();

    //         $company_info = null;
    //         $company = Companies::find($account->company_id);
    //         if ($company) {
    //             $company_info = [
    //                 'company_id' => $company->company_id,
    //                 'company_name' => $company->company_name,
    //                 'company_phone' => $company->company_phone,
    //                 'company_address' => $company->address,
    //                 'first_name' => $account->first_name,
    //                 'last_name' => $account->last_name,
    //                 'email' => $account->email,
    //                 'phone_number' => $account->phone_number
    //             ];
    //         }

    //         // Retrieve the order_id after saving the order header
    //         $order_id = $order->order_id;

    //         // Create and save the order details
    //         foreach ($request->input('order_details') as $detail) {
    //             $orderDetail = new OrderDetails();
    //             $orderDetail->order_id = $order_id; // Assign the order ID
    //             $orderDetail->turn_around_id = $detail['turn_around_id'];
    //             $orderDetail->price= $detail['price'];
    //             $orderDetail->quantity = $detail['required_quantity'];
    //             $orderDetail->quantity_pumps = $detail['required_pumps'];
    //             $orderDetail->quantity_media = $detail['required_media'];
    //             $orderDetail->comments = $detail['customer_comment'];
    //             $orderDetail->save();

    //             // Retrieve method name and analyte name based on turn_around_id
    //             $turnAround = TurnAroundTime::find($detail['turn_around_id']);
    //             if ($turnAround) {

    //                 $orderDetail->price = $turnAround->price;

    //                 $orderDetail->turnaround_time = $turnAround->turnaround_time;

    //                 $method = Methods::find($turnAround->method_id);

    //                 if ($method) {
    //                     $orderDetail->method_name = $method->method_name;
    //                     $analyte = Analytes::find($method->analyte_id);
    //                     if ($analyte) {
    //                         $orderDetail->analyte_name = $analyte->analyte_name;
    //                     }
    //                 }
    //             }

    //             // Add order detail to the array
    //             $orderDetailsArray[] = $orderDetail;
    //         }

    //         // Commit the transaction
    //         \DB::commit();

    //         // EMAIL TRIGGER GOES HERE
    //         // After Committing the transaction
    //         // Instantiate the Mailable class and send the email
    //         // Instantiate the Mailable class
    //         $email = new EmailOrder($order, $orderDetailsArray, $company_info);

    //         // Call the build method to prepare the email
    //         $email->build();

    //         // Return a success response
    //         return response()->json(['message' => 'Order created successfully', 'order_id' => $order_id], 201);
    //     } catch (\Exception $e) {
    //         // Rollback the transaction if an exception occurs
    //         \DB::rollback();
    //         // Handle the exception, log it, or return an error response
    //         return response()->json(['message' => 'Failed to create order', 'error' => $e->getMessage()], 500);
    //     }
    // }
}
