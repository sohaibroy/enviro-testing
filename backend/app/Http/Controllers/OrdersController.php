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

class OrdersController extends Controller
{
    // Shows all records in the orders table
    public function index()
    {
        $orders = Orders::all();

        return response()->json($orders);
    }

    public function createOrder($order)
    {
        // Validate the incoming JSON data
        $validator = Validator::make($order, [
            'order.transaction_id' => 'required|integer|min:1|max:11',
            'order.subtotal' => 'required|numeric',
            'order_details.*.turn_around_id' => 'required|integer',
            'order_details.*.price' => 'required|numeric',
            'order_details.*.required_quantity' => 'required|integer|min:1',
            'order_details.*.required_pumps' => 'nullable|integer|max:11',
            'order_details.*.required_media' => 'nullable|integer|max:11',
            'order_details.*.customer_comment' => 'nullable|string|max:255',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            throw new Exception(json_encode($validator->errors()), 422);
        }

        try {
            // Begin a database transaction
            \DB::beginTransaction();

            // Create and save the order header
            $orderRecord = new Orders();
            $orderRecord->transaction_id = $order['transaction_id'];
            $orderRecord->total_amount = $order['total_amount'];
            $orderRecord->subtotal = $order['subtotal'];
            $orderRecord->save();

            // Retrieve the order_id after saving the order header
            $order_id = $orderRecord->order_id;

            // Create and save the order details
            foreach ($request->input('order_details') as $detail) {
                $orderDetail = new OrderDetails();
                $orderDetail->order_id = $order_id; // Assign the order ID
                $orderDetail->turn_around_id = $detail['turn_around_id'];
                $orderDetail->price = $detail['price'];
                $orderDetail->quantity = $detail['required_quantity'];
                $orderDetail->quantity_pumps = $detail['required_pumps'];
                $orderDetail->quantity_media = $detail['required_media'];
                $orderDetail->comments = $detail['customer_comment'];
                $orderDetail->save();
            }

            // Commit the transaction
            \DB::commit();

            // Return a success response
            return $orderRecord;
        } catch (\Exception $e) {
            // Rollback the transaction if an exception occurs
            \DB::rollback();
            // Rethrow to be caught by createTransaction
            throw $e;
        }
    }

    // Search for a specific order by order_id
    // search by company name and date
    public function getOrderByOrderId($order_id)
    {
        if(!is_numeric($order_id) || $order_id < 1){
            return response()->json(['message'=>'Please enter a valid order id'],400);
        }

        $order = Orders::find($order_id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
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
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        // $orders = DB::table('orders')
        //     ->join('transactions', 'transactions.transaction_id', '=', 'orders.transaction_id')
        //     ->join('accounts', 'accounts.account_id', '=', 'transactions.account_id')
        //     ->join('companies', 'companies.company_id', '=', 'accounts.company_id')
        //     ->select('orders.order_id',
        //         'orders.order_date',
        //         'orders.subtotal',
        //         'orders.is_active',
        //         'accounts.account_id',
        //         'accounts.company_id',
        //         'accounts.first_name',
        //         'accounts.last_name',
        //         'accounts.email',
        //         'accounts.phone_number',
        //         'companies.company_id',
        //         'companies.company_name',
        //         'companies.address',
        //         'companies.company_phone')
        //     ->get();
        $orders = DB::table('orders')
        ->select('orders.order_id', 'orders.order_date', 'orders.subtotal', 'orders.is_active')
        ->get();

        // Return the order details along with the related company and account info
        return response()->json($orders);
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
