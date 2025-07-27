<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MonerisController extends Controller
{
    public function startCheckout(Request $request)
    {
        // Placeholder: prepare order and redirect user to Moneris
        // You’ll use Moneris HPP parameters here later
        return response()->json([
            'redirectUrl' => 'https://esqa.moneris.com/HPPDP/index.php', // testing URL to moneris
            'payload' => [
                // Include any form fields needed for Moneris
                'ps_store_id' => 'enviro_work_store_id',
                'hpp_key' => 'your_hpp_key_moneris',
                'charge_total' => $request->amount,
                'cust_id' => $request->user_id,
                'order_id' => uniqid('order_'),
                'return_url' => route('moneris.callback'),
                // more fields if needed
            ]
        ]);
    }

   public function handleCallback(Request $request)
{
    $data = $request->all();

    //Validate HMAC/hash from Moneris (for security best practices)

    // Save payment result to order record
    $orderId = $data['order_id'] ?? null;
    $paymentStatus = $data['response_code'] == '027' ? 'approved' : 'declined'; // 027 is success

    // Store receipt (you might store: txn_number, card_type, etc.)
    Order::where('order_id', $orderId)->update([
        'payment_status' => $paymentStatus,
        'receipt_data' => json_encode($data),
    ]);

    // Redirect to frontend receipt page
    return redirect()->to("https://your-frontend.com/order/receipt?order_id={$orderId}&status={$paymentStatus}");
}

}