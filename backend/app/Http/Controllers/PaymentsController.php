<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;

class PaymentsController extends Controller
{
    public function index() {
        $user = Auth::user();

        if (!strpos($user, 'admin')) {
            return response()->json(['message' => 'You are not authorized to view this page.'], 401);
        }

        $payments = Payments::all();

        return response()->json($payments);
    }

    public function createPayment($payment) {
        $validator = Validator::make($payment, [
            'payment.amount' => 'nullable|numeric|min:0',
            'payment.card_holder_name' => 'nullable|string|max:255',
            'payment.card_number' => 'nullable|string|size:16',
            'payment.expiry_month' => 'nullable|string|size:2',
            'payment.expiry_year' => 'nullable|string|size:4',
            'payment.payment_token' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            // Error to be caught by createTransaction
            throw new Exception(json_encode($validator->errors()), 422);
        }

        try {
            DB::beginTransaction();

            $paymentRecord = Payments::create([
                'transaction_id' => $payment['transaction_id'],
                'amount' => $payment['payment']['amount'],
                'card_holder_name' => $payment['payment']['card_holder_name'],
                'card_number' => $payment['payment']['card_number'],
                'expiry_month' => $payment['payment']['expiry_month'],
                'expiry_year' => $payment['payment']['expiry_year'],
                'payment_token' => $payment['payment']['payment_token'],
            ]);

            DB::commit();

            return $paymentRecord;
        } catch (\Exception $e) {
            DB::rollback();
            // Rethrow to be caught by createTransaction
            throw $e;
        }
    }

    public function getPaymentByTransactionId($transaction_id) {
        $payment = Payments::where('transaction_id', $transaction_id)->first();

        if (!$payment) {
            throw new Exception('Payment not found', 404);
        }

        return $payment;
    }
}
