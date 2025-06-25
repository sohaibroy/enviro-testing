<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderDetails;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrderDetailsController extends Controller
{
    // Shows all records in the order_details table
    public function index()
    {
        $orderDetails = OrderDetails::all();
        return response()->json($orderDetails);
    }
    // public function createOrderDetails(Request $request,$order_id)
    // {
    //     $validator= Validator::make($request->all(),[
    //         'method_id'=>'required',
    //         'quantity'=>'required',
    //         'quantity_pumps'=>'nullable|numeric|max 11',
    //         'quantity_media'=>'nullable|numeric|max 11',
    //         'comments'=>'nullable|string|255'
    //     ]);
    //     if($validator->fails()){
    //         return response()->json(['errors' => $validator->errors()], 400);
    //     }
    //     $orderdetail = new OrderDetails();
    //     $orderdetail->order_id=$order_id;
    //     $orderdetail->method_id=$request->input('method_id');
    //     $orderdetail->quantity= $request->input('quantity');
    //     $orderdetail->quantity_pumps=$request->input('quantity_pumps');
    //     $orderdetail->comments=$request->input('comments');
    //     $orderdetail->save();

    //     return response()->json(['message' => 'You have created a new order detail'], 200);

    // }

    public function GetOrderDetails($order_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        if(!is_numeric($order_id) || $order_id < 1){
            return response()->json(['message'=>'Please enter a valid order id'],400);
        }
        
        $viewOrderDetails = DB::table('order_details as o')
            ->select('o.order_id', 'o.quantity', 'o.quantity_pumps','o.quantity_media', 'o.comments',
                     'o.price', 't.turnaround_time',
                     'm.method_name', 'm.media',
                     'a.analyte_name')
            ->leftJoin('turn_around_times as t', 'o.turn_around_id', '=', 't.turn_around_id')
            ->leftJoin('methods as m', 't.method_id', '=', 'm.method_id')
            ->leftJoin('analytes as a', 'm.analyte_id', '=', 'a.analyte_id')
            ->where('o.order_id', $order_id)
            ->get();
    
        if ($viewOrderDetails->isEmpty()) {
            return response()->json(['message' => 'No order found'], 404);
        }
    
        return response()->json($viewOrderDetails);
    }
}
