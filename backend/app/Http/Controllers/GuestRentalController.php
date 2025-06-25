<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Accounts;
use App\Models\Rentals;
use App\Models\RentalDetails;

class GuestRentalController extends Controller
{
    public function storeGuestRental(Request $request)
    {
        Log::info('--- guest rental start ---');
        Log::info('incoming request', $request->all());

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone_number' => 'nullable|string|max:20',
            'rental_header.rental_date' => 'required|date',
            'rental_header.subtotal' => 'required|numeric',
            'rental_header.gst' => 'required|numeric',
            'rental_details' => 'required|array',
            'rental_details.*.equipment_id' => 'required|integer',
            'rental_details.*.start_date' => 'required|date',
            'rental_details.*.end_date' => 'required|date',
            'rental_details.*.quantity' => 'required|integer|min:1',
            'rental_details.*.price' => 'required|numeric',
        
            // optional business fields
            'business_name' => 'nullable|string|max:255',
            'business_phone' => 'nullable|string|max:20',
            'business_address' => 'nullable|string|max:255',
            'business_city' => 'nullable|string|max:255',
            'business_province' => 'nullable|string|max:255',
            'business_postal_code' => 'nullable|string|max:20',
        ]);

        DB::beginTransaction();

        try {
            $account = Accounts::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'phone_number' => $validated['phone_number'] ?? null,
                    'company_id' => null,
                    'is_active' => 0,
                    'password' => bcrypt('guest123')
                ]
            );
            Log::info('created/found account', ['account_id' => $account->account_id]);

            $rental = Rentals::create([
                'account_id' => $account->account_id,
                'rental_date' => $request->input('rental_header.rental_date'),
                'subtotal' => $request->input('rental_header.subtotal'),
                'gst' => $request->input('rental_header.gst'),
                'is_complete' => 0,
            ]);
            Log::info('created rental', ['rental_id' => $rental->rental_id]);

            foreach ($validated['rental_details'] as $detail) {
                RentalDetails::create([
                    'rental_id' => $rental->rental_id,
                    'equipment_id' => $detail['equipment_id'],
                    'start_date' => $detail['start_date'],
                    'end_date' => $detail['end_date'],
                    'quantity' => $detail['quantity'],
                    'price' => $detail['price'],
                    'is_active' => 1,
                ]);
            }
            Log::info('inserted rental details');

            try {
                DB::table('payments')->insert([
                    'order_id' => $rental->rental_id,
                    'amount' => $request->input('rental_header.subtotal') + $request->input('rental_header.gst'),
                    'payment_status' => 'pending',
                    'payment_method' => $request->input('payment_method'),
                    'transaction_reference' => 'guest-' . uniqid(),
                    'card_holder_name' => $request->input('card_holder_name'),
                    'card_last_four' => substr(preg_replace('/\D/', '', $request->input('card_number')), -4),
                    'card_expiry_month' => $request->input('card_expiry_month'),
                    'card_expiry_year' => $request->input('card_expiry_year'),
                    'payment_token' => $request->input('payment_token'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                Log::info('inserted payment');
            } catch (\Throwable $e) {
                Log::error('payment insert failed', ['error' => $e->getMessage()]);
                throw $e;
            }

            DB::table('guest_customers')->insert([
                'rental_id' => $rental->rental_id,
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone_number'] ?? null,
                'business_name' => $request->input('business_name'),
                'business_phone' => $request->input('business_phone'),
                'business_address' => $request->input('business_address'),
                'business_city' => $request->input('business_city'),
                'business_province' => $request->input('business_province'),
                'business_postal_code' => $request->input('business_postal_code'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            Log::info('inserted guest_customer info');
            DB::commit();
            Log::info('--- guest rental success ---');

            return response()->json([
                'message' => 'Guest rental created successfully.',
                'rental_id' => $rental->rental_id
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('guest rental failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to create rental.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
