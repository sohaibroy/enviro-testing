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

    public function index()
{
    if (!$this->isAdmin()) {
        return response()->json(['message' => 'You are not authorized to view this page'], 401);
    }

    $txns = DB::table('transactions as t')
        ->leftJoin('orders as o', 'o.transaction_id', '=', 't.transaction_id')
        ->leftJoin('accounts as a', 'a.account_id', '=', 't.account_id')
        ->leftJoin('companies as c', 'c.company_id', '=', 'a.company_id')
        ->select([
            // transactions
            't.transaction_id',
            't.account_id',
            't.transaction_date',
            't.subtotal',
            't.gst',
            't.total_amount',
            't.is_active',

            // orders
            'o.order_id',
            'o.status as order_status',
            'o.order_date',
            'o.subtotal as order_subtotal',
            'o.gst as order_gst',
            'o.total_amount as order_total',

            // account (person)
            'a.first_name',
            'a.last_name',
            'a.phone_number',
            'a.email',
            'a.company_id',

            // company
            'c.company_name',
            'c.company_phone',
            'c.address',

            // effective is_active (auto-inactive if order completed)
            DB::raw('CASE WHEN o.status = 2 THEN 0 ELSE t.is_active END AS is_active_effective'),
        ])
        ->orderByDesc('t.transaction_date')
        ->get()
        ->map(function ($row) {
            $row->is_active = (int) $row->is_active_effective;
            unset($row->is_active_effective);
            return $row;
        });

    return response()->json($txns);
}

    public function createTransaction(Request $request)
{
    //validate core fields up front
    $request->validate([
        'transaction.subtotal'      => 'required|numeric|min:0',
        'transaction.gst'           => 'required|numeric|min:0',
        'transaction.total_amount'  => 'required|numeric|min:0',
        'account.email'             => 'nullable|email', // only for guests
        'rental'                    => 'nullable|array',
        'rental_details'            => 'nullable|array',
        'rental_details.*.equipment_id' => 'required_with:rental_details|integer',
        'rental_details.*.quantity'     => 'required_with:rental_details|integer|min:1',
    ]);

    DB::beginTransaction();

    try {
        $data = $request->all();

        Log::info('[createTransaction] Auth check', ['isAuthenticated' => Auth::check()]);

        // ---------------------------
        // Resolve account & billing
        // ---------------------------
        if (Auth::check()) {
            $account        = Auth::user();
            $accountId      = $account->account_id;
            $cardholderName = trim(($account->first_name ?? '') . ' ' . ($account->last_name ?? ''));
            $creditCard     = null; // don't store raw card
            $expiryMonth    = '';
            $expiryYear     = '';
        } else {
            // Guest flow must include account payload
            if (empty($data['account'])) {
                Log::error('[createTransaction] Missing account data for guest order');
                return response()->json(['error' => 'Account data is missing'], 400);
            }
            $billing = $data['account'];

            //Try to re-use existing account by email (prevents duplicates)
            $existing = null;
            if (!empty($billing['email'])) {
                $existing = DB::table('accounts')->where('email', $billing['email'])->first();
            }

            if ($existing) {
                $accountId = $existing->account_id;
            } else {
                $accountId = DB::table('accounts')->insertGetId([
                    'first_name'     => $billing['first_name']     ?? '',
                    'last_name'      => $billing['last_name']      ?? '',
                    'email'          => $billing['email']          ?? '',
                    'phone_number'   => $billing['phone_number']   ?? '',
                    'street_address' => $billing['street_address'] ?? '',
                    'city'           => $billing['city']           ?? '',
                    'province'       => $billing['province']       ?? '',
                    'postal_code'    => $billing['postal_code']    ?? '',
                    'country'        => $billing['country']        ?? '',
                    // Consider removing this column in prod; Stripe should hold cards
                    'credit_card'    => $billing['credit_card']    ?? '',
                    'is_active'      => 1,
                    'company_id'     => null,
                    'password'       => null,
                    'job_title'      => null,
                    // 'is_guest'    => 1, // optional flag if you have it
                ]);
            }

            $cardholderName = $billing['cardholder_name'] ?? '';
            $creditCard     = $billing['credit_card']     ?? null;
            $expiryMonth    = $billing['expiry_month']    ?? '';
            $expiryYear     = $billing['expiry_year']     ?? '';
        }

        // ---------------------------
        // Create transaction
        // ---------------------------
        $t = $data['transaction'];
        $transactionId = DB::table('transactions')->insertGetId([
            'account_id'   => $accountId,
            'subtotal'     => $t['subtotal'],
            'gst'          => $t['gst'],
            'total_amount' => $t['total_amount'],
        ]);

        Log::info('[createTransaction] Transaction created', ['transaction_id' => $transactionId]);

        // ---------------------------
        // Rentals (optional)
        // ---------------------------
        if (!empty($data['rental'])) {
            $rental    = $data['rental'];
            $rentalId  = DB::table('rentals')->insertGetId([
                'transaction_id' => $transactionId,
                'rental_date'    => $rental['rental_date'] ?? now(),
                'subtotal'       => $t['subtotal'],
            ]);

            Log::info('[createTransaction] Rental created', ['rental_id' => $rentalId]);

            foreach (($data['rental_details'] ?? []) as $detail) {
                $equipmentId = $detail['equipment_id'];
                $quantity    = $detail['quantity'] ?? 1;

                $serials = DB::table('equipment_details')
                    ->where('equipment_id', $equipmentId)
                    ->where('status', 'available')
                    ->limit($quantity)
                    ->pluck('serial_id');

                if ($serials->count() < $quantity) {
                    throw new \Exception("Not enough available serials for equipment ID {$equipmentId}");
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

            Log::info('[createTransaction] Rental details saved & serials marked rented');
        }

        // ---------------------------
        // Payment (pending) — order is created later in webhook on "paid"
        // ---------------------------
        DB::table('payments')->insert([
            'transaction_id'    => $transactionId,
            'card_holder_name'  => $cardholderName,
            'card_expiry_month' => $expiryMonth,
            'card_expiry_year'  => $expiryYear,
            'card_last_four'    => $creditCard ? substr($creditCard, -4) : null,
            'payment_method'    => 'credit_card',
            'payment_status'    => 'pending',
            'amount'            => $t['total_amount'],
        ]);

        Log::info('[createTransaction] Payment saved (pending)');

        DB::commit();

        return response()->json([
            'message'        => 'Transaction successful',
            'transaction_id' => $transactionId,
        ], 201);

    } catch (\Throwable $e) {
        DB::rollBack();
        Log::error('[createTransaction] Failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
        return response()->json([
            'error' => 'Transaction failed: ' . $e->getMessage(),
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

    private function isAdmin(): bool
{
    $user = Auth::user();
    if (!$user) return false;
    $haystack = strtolower((string)($user->role ?? $user->email ?? ''));
    return str_contains($haystack, 'admin');
}
}
