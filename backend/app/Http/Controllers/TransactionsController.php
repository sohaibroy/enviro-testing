<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transactions;
use App\Models\Accounts;
use App\Models\Companies;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TransactionsController extends Controller
{
    /*
    * This is a master controller for all orders, rentals, orders+rentals as single transaction, and payments.
    * All data is transferred via one GET or POST request which is then separated into their respective controllers for final processing.
    */

    public function index() {
        $user = Auth::user();

        if (!strpos($user, 'admin')) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $transactions = Transactions::all();

        return response()->json($transactions);
    }

    public function createTransaction(Request $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->all();

            Log::info('Auth check result:', ['isAuthenticated' => Auth::check()]);
            if (Auth::check()) {
                $accountUser = Auth::user();
                  // Payment fields (credit_card, expiry_month, expiry_year) are missing from the accounts table, so they are set to null/empty here.
                $billing = [
                    'cardholder_name' => "{$accountUser->first_name} {$accountUser->last_name}",
                    'credit_card' => null, 
                    'expiry_month' => '',
                    'expiry_year' => '',
                ];
            } else {
                // For non-authenticated users
                if (!isset($data['account'])) {
                    Log::error('Missing account data for guest order');
                    return response()->json(['error' => 'Account data is missing'], 400);
                }
                Log::info('Incoming account data:', $data['account']);
                $billing = $data['account'];
            }

            if (Auth::check()) {
                $account = Auth::user();
                $accountId = $account->account_id;

                $cardholderName = $billing['cardholder_name'] ?? "{$account->first_name} {$account->last_name}";
                $creditCard = $billing['credit_card'] ?? null;
                $expiryMonth = $billing['expiry_month'] ?? '';
                $expiryYear = $billing['expiry_year'] ?? '';
            } else {
                $accountId = DB::table('accounts')->insertGetId([
                    'first_name'     => $billing['first_name'] ?? '',
                    'last_name'      => $billing['last_name'] ?? '',
                    'email'          => $billing['email'] ?? '',
                    'phone_number'   => $billing['phone_number'] ?? '',
                    'street_address' => $billing['street_address'] ?? '',
                    'city'           => $billing['city'] ?? '',
                    'province'       => $billing['province'] ?? '',
                    'postal_code'    => $billing['postal_code'] ?? '',
                    'country'        => $billing['country'] ?? '',
                    'credit_card'    => $billing['credit_card'] ?? '',
                    'is_active'      => 1,
                    'company_id'     => null,
                    'password'       => null,
                    'job_title'      => null,
                ]);
                $cardholderName = $billing['cardholder_name'] ?? '';
                $creditCard = $billing['credit_card'] ?? '';
                $expiryMonth = $billing['expiry_month'] ?? '';
                $expiryYear = $billing['expiry_year'] ?? '';
            }

            $transaction = $data['transaction'];
            $transactionId = DB::table('transactions')->insertGetId([
                'account_id'    => $accountId,
                'subtotal'      => $transaction['subtotal'] ?? 0,
                'gst'           => $transaction['gst'] ?? 0,
                'total_amount'  => $transaction['total_amount'] ?? 0,
            ]);
            Log::info("Transaction created with ID: $transactionId");

            // --- RENTAL LOGIC ---
            if (isset($data['rental'])) {
                $rental = $data['rental'];
                $rentalId = DB::table('rentals')->insertGetId([
                    'transaction_id' => $transactionId,
                    'rental_date'    => $rental['rental_date'] ?? now(),
                    'subtotal'       => $transaction['subtotal'] ?? 0,
                ]);
                Log::info("Rental created with ID: $rentalId");

                foreach ($data['rental_details'] as $detail) {
                    $equipmentId = $detail['equipment_id'];
                    $quantity = $detail['quantity'] ?? 1;

                    $serials = DB::table('equipment_details')
                        ->where('equipment_id', $equipmentId)
                        ->where('status', 'available')
                        ->limit($quantity)
                        ->pluck('serial_id');

                    if ($serials->count() < $quantity) {
                        throw new \Exception("Not enough available serials for equipment ID $equipmentId");
                    }

                    foreach ($serials as $serialId) {
                        DB::table('rental_details')->insert([
                            'rental_id'           => $rentalId,
                            'serial_id'           => $serialId,
                            'quantity'            => 1,
                            'price'               => $detail['price'] ?? 0,
                            'start_date'          => $detail['start_date'] ?? null,
                            'end_date'            => $detail['end_date'] ?? null,
                            'equipment_condition' => $detail['condition'] ?? 'good',
                            'is_active'           => 1,
                        ]);

                        DB::table('equipment_details')
                            ->where('serial_id', $serialId)
                            ->update(['status' => 'rented']);
                    }
                }
                Log::info("Rental details and serials saved.");
            }

            // --- ORDER LOGIC ---
            if (isset($data['order'])) {
                $order = $data['order'];
                $orderId = DB::table('orders')->insertGetId([
                    'transaction_id' => $transactionId,
                    'order_date'     => $order['order_date'] ?? now(),
                    'subtotal'       => $order['subtotal'] ?? 0,
                    'is_active'      => 1,
                ]);
                Log::info("Order created with ID: $orderId");

                foreach ($data['order_details'] ?? [] as $item) {
                    DB::table('order_details')->insert([
                        'order_id'   => $orderId,
                        'item_name'  => $item['item_name'] ?? '',
                        'quantity'   => $item['quantity'] ?? 1,
                        'price'      => $item['price'] ?? 0,
                    ]);
                }
                Log::info("Order details saved.");
            }

            // --- PAYMENT LOGIC ---
            DB::table('payments')->insert([
                'transaction_id'     => $transactionId,
                'card_holder_name'   => $cardholderName,
                'card_expiry_month'  => $expiryMonth,
                'card_expiry_year'   => $expiryYear,
                'card_last_four'     => substr($creditCard, -4),
                'payment_method'     => 'credit_card',
                'payment_status'     => 'pending',
                'amount'             => $transaction['total_amount'] ?? 0,
            ]);
            Log::info("Payment saved.");

            DB::commit();

            return response()->json(['message' => 'Transaction successful'], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Transaction creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error' => 'Transaction failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAllTransactionsWithRelatedTables() {
        $user = Auth::user();

        if (strpos($user, 'admin') === FALSE) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }
        try {
            $transactions = Transactions::with(['accounts', 'rentals', 'rentals.rentalDetails', 'orders', 'orders.orderDetails', 'payments', 'accounts.company'])->get();

            return response()->json($transactions, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve transactions'], 500);
        }
    }

    public function searchTransactions($searchValue) {
        $user = Auth::user();

        if (strpos($user, 'admin') === FALSE) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        try {
            $transactionQuery = Transactions::query();

            $transactionQuery->leftJoin('accounts', 'transactions.account_id', '=', 'accounts.account_id')
                ->leftJoin('orders', 'transactions.transaction_id', '=', 'orders.transaction_id')
                ->leftJoin('rentals', 'transactions.transaction_id', '=', 'rentals.transaction_id')
                ->leftJoin('companies', 'accounts.company_id', '=', 'companies.company_id')
                ->leftJoin('payments', 'payments.transaction_id', '=', 'transactions.transaction_id');

            $transactionQuery->where(function($q) use ($searchValue) {
                $q->where('transactions.transaction_id', $searchValue)
                    ->orWhere('accounts.account_id', $searchValue)
                    ->orWhere('orders.order_id', $searchValue)
                    ->orWhere('rentals.rental_id', $searchValue)
                    ->orWhere('payments.payment_id', $searchValue)
                    ->orWhere('companies.company_id', $searchValue)
                    ->orWhere('companies.company_name', 'LIKE', "%{$searchValue}%")
                    ->orWhere('accounts.first_name', 'LIKE', "%{$searchValue}%")
                    ->orWhere('accounts.last_name', 'LIKE', "%{$searchValue}%")
                    ->orWhereRaw("CONCAT(accounts.first_name, ' ', accounts.last_name) LIKE ?", ["%{$searchValue}%"]);
            });

            $transactionQuery->select(
                'transactions.*',
                'accounts.account_id',
                'accounts.first_name',
                'accounts.last_name',
                'accounts.phone_number',
                'accounts.email',
                'companies.company_id',
                'companies.company_name',
                'companies.address',
                'companies.company_phone',
                'orders.order_id',
                'orders.order_date',
                'orders.subtotal as order_subtotal',
                'orders.is_active as order_is_active',
                'rentals.rental_id',
                'rentals.rental_date',
                'rentals.subtotal as rental_subtotal',
                'rentals.is_complete',
                'payments.payment_id',
                'payments.payment_status',
                'payments.amount'
            )->distinct();

            $transactionIds = $transactionQuery->pluck('transactions.transaction_id');

            $searchResults = Transactions::with([
                'accounts',
                'accounts.company',
                'orders',
                'rentals',
                'payments'
            ])->whereIn('transaction_id', $transactionIds)->get();

            if ($searchResults->isEmpty()) {
                return response()->json(['message' => 'No transactions found'], 404);
            }

            return response()->json($searchResults);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to search transactions: '.$e->getMessage()], 500);
        }
    }

    public function updateTransaction(Request $request, $transaction_id) {
        $user = Auth::user();

        if (strpos($user, 'admin') === FALSE) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        if(!is_numeric($transaction_id) || $transaction_id < 1){
            return response()->json(['message'=>'Please enter a valid transaction id'],400);
        }

        $validator = Validator::make($request->all(), [
            'is_active' => 'required|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $is_active = $request->input('is_active');

        $affectedRows = Transactions::where('transaction_id', $transaction_id)
            ->update(['is_active' => $is_active]);

        if ($affectedRows === 0) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        return response()->json(['message' => 'Transaction updated successfully'], 200);
    }
}
