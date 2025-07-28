<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Illuminate\Http\Request;
use App\Models\Rentals;
use App\Models\RentalDetails;
use App\Models\Equipment;
use App\Models\Accounts;
use App\Models\Companies;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class RentalsController extends Controller
{
    // Show all records in rentals table.
     public function index()
     {
         $rentals = Rentals::all();

            return response()->json($rentals);
     }

    public function storeRentals(Request $request)
    {
        // Get the user
        $user = Auth::user();

        // Get the account ID for the user
        $login_account_id = $user->account_id;

        // Validate incoming JSON data
        $validator = Validator::make($request->all(), [
            'rental_header.rental_date' => 'required|date',
            'rental_header.subtotal' => 'required|numeric',
            'rental_header.gst' => 'required|numeric',
            'rental_details.*.serial_id' => 'required|integer',
            'rental_details.*.start_date' => 'required|date',
            'rental_details.*.end_date' => 'required|date',
            'rental_details.*.quantity' => 'required|integer|min:1',
            'rental_details.*.price' => 'required|numeric',
            'rental_details.*.condition' => 'required|string|max:255',
            'payment_method' => 'nullable|string|max:50',
            'card_holder_name' => 'nullable|string|max:255',
            'card_number' => 'nullable|string',
            'card_expiry_month' => 'nullable|string',
            'card_expiry_year' => 'nullable|string',
            'payment_token' => 'nullable|string',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Begin a transaction
        \DB::beginTransaction();

        try {
            // Create and save the rental header
            $rental = new Rentals();
            $rental->account_id = $login_account_id;
            $rental->rental_date = $request->input('rental_header.rental_date');
            $rental->subtotal = $request->input('rental_header.subtotal');
            $rental->gst = $request->input('rental_header.gst');
            $rental->is_complete = 0;
            $rental->save();

            $account = Accounts::find($login_account_id);
            $company_info = null;

            if ($account) {
                $account_first_name = $account->first_name;
                $account_last_name = $account->last_name;
                $account_email = $account->email;

                $company = Companies::find($account->company_id);
                if ($company) {
                    $company_info = [
                        'company_id' => $company->company_id,
                        'company_name' => $company->company_name,
                        'company_phone' => $company->company_phone,
                        'company_address' => $company->address,
                        'first_name' => $account_first_name,
                        'last_name' => $account_last_name,
                        'email' => $account_email,
                    ];
                }
            }

            // Retrieve the rental_id after saving the order header
            $rental_id = $rental->rental_id;

            // Create and save the rental details
            foreach ($request->input('rental_details') as $detail) {
                $rental_detail = new RentalDetails();
                $rental_detail->rental_id = $rental_id;
                $rental_detail->equipment_id = $detail['serial_id'];
                $rental_detail->start_date = $detail['start_date'];
                $rental_detail->end_date = $detail['end_date'];
                $rental_detail->quantity = $detail['quantity'];
                $rental_detail->price = $detail['price'];
                // $rental_detail->condition = $detail['condition'];
                $rental_detail->is_active = 1;
                $rental_detail->save();

                // Add the rental detail to the array
                $rental_details_array[] = $rental_detail;
            }

            DB::table('payments')->insert([
                'order_id' => $rental_id,
                'amount' => $request->input('rental_header.subtotal') + $request->input('rental_header.gst'),
                'payment_status' => 'pending',
                'payment_method' => $request->input('payment_method'),
                'transaction_reference' => 'user-' . uniqid(),
                'card_holder_name' => $request->input('card_holder_name'),
                'card_last_four' => substr(preg_replace('/\D/', '', $request->input('card_number')), -4),
                'card_expiry_month' => $request->input('card_expiry_month'),
                'card_expiry_year' => $request->input('card_expiry_year'),
                'payment_token' => $request->input('payment_token'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Commit the transaction
            \DB::commit();

            // Send an email to the user
            // $email = new EmailRental($rental, $rental_details_array, $company_info);
            // $email->build();

            // Return a success response
            return response()->json(['message' => 'Rental created successfully', 'rental_id' => $rental_id], 201);
        } catch (\Exception $e) {
            // Rollback the transaction
            \DB::rollBack();
            return response()->json(['message' => 'Failed to create rental', 'error' => $e->getMessage()], 500);
        }
    }

    // Search for a specific rental by rental_id
    public function show($rental_id)
    {
        if(!is_numeric($rental_id) || $rental_id < 1) {
            return response()->json(['message' => 'Please enter a valid rental ID'], 400);
        }

        $rental = Rentals::find($rental_id);

        if (!$rental) {
            return response()->json(['message' => 'Rental not found'], 404);
        }

        return response()->json($rental);
    }

    public function searchRentalTool($searchValue)
    {
        $searchTerm = $searchValue;

        $searchResults = DB::table('rentals')
        ->join('accounts', 'rentals.account_id', '=', 'accounts.account_id')
        ->join('companies', 'accounts.company_id', '=', 'companies.company_id')
        ->select('rentals.rental_id',
            'rentals.rental_date',
            'rentals.subtotal',
            'rentals.gst',
            'rentals.is_complete',
            'accounts.account_id',
            'accounts.company_id',
            'accounts.first_name',
            'accounts.last_name',
            'accounts.email',
            'accounts.phone_number',
            'companies.company_id',
            'companies.company_name',
            'companies.company_phone',
            'companies.address',
            'companies.company_phone')
        ->where(function($query) use ($searchTerm) {
            $query->where('rentals.rental_date', 'like', "%$searchTerm%")
                ->orWhere('rentals.rental_id',  $searchTerm)
                ->orWhere('companies.company_name', 'like', "%$searchTerm%");
        })
        ->get();
        if($searchResults->isEmpty()) {
            return response()->json(['message' => 'No rentals found'], 404);
        } else {
            return response()->json(['message'=>$searchResults], 200);
        }
    }

    // Update an existing rental record
    public function updateRentals(Request $request, $rental_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        if (!is_numeric($rental_id) || $rental_id < 1) {
            return response()->json(['message' => 'Please enter a valid rental ID'], 400);
        }

        $validator = Validator::make($request->all(), [
            'is_complete' => 'required|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $is_complete = $request->input('is_complete');

        $affected_rows = DB::table('rentals')
        ->where('rental_id', $rental_id)
        ->update([
            'is_complete' => $is_complete
        ]);

        if ($affected_rows === 0) {
            return response()->json(['message' => 'Rental not found'], 404);
        }

        return response()->json(['message' => 'Rental updated successfully'], 200);
    }

    // Get all rental details for a specific rental with related company and account info
    public function ExtremeRentalInfo()
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $rentals = DB::table('rentals')
        ->join('accounts', 'rentals.account_id', '=', 'accounts.account_id')
        ->join('companies', 'accounts.company_id', '=', 'companies.company_id')
        ->select(
            'rentals.rental_id',
            'rentals.rental_date',
            'rentals.subtotal',
            'rentals.gst',
            'rentals.is_complete',
            'accounts.first_name as account_first_name',
            'accounts.last_name as account_last_name',
            'companies.company_name'
        )
        ->orderByDesc('rentals.rental_date')
        ->get();

    return response()->json(['message' => $rentals], 200);
}



    public function storeWalkinRentals(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rental_header.rental_date' => 'required|date',
            'rental_header.subtotal' => 'required|numeric',
            'rental_header.gst' => 'required|numeric',
            'rental_details.*.serial_id' => 'required|integer',
            'rental_details.*.start_date' => 'required|date',
            'rental_details.*.end_date' => 'required|date',
            'rental_details.*.quantity' => 'required|integer|min:1',
            'rental_details.*.price' => 'required|numeric',
            'rental_details.*.condition' => 'required|string|max:255',
            'rental_header.firstName' => 'required|string|max:255',
            'rental_header.lastName' => 'required|string|max:255',
            'rental_header.email' => 'required|email|max:255',
            'rental_header.phoneNumber' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        \DB::beginTransaction();

        try {
            $account_id = "";
            $account = null;

            $existingAccount = Accounts::where('email', $request->input('rental_header.email'))->first();
            if ($existingAccount) {
                $account_company_id = $existingAccount->company_id;
                if ($account_company_id !== 1) {
                    return response()->json(['message' => 'Please log in to the portal to make a rental'], 420);
                }
                $account = $existingAccount;
                $account_id = $existingAccount->account_id;
            }
            else {
                $account = new Accounts();
                $account->first_name = $request->input('rental_header.firstName');
                $account->last_name = $request->input('rental_header.lastName');
                $account->email = $request->input('rental_header.email');
                $account->password = HASH::make($request->input('rental_header.firstName') . $request->input('rental_header.lastName') . 'EnviroWorks1');
                $account->phone_number = $request->input('rental_header.phoneNumber');
                $account->company_id = 1;
                $account->is_active = 0;
                $account->save();

                $account_id = $account->account_id;
            }

            $rental = new Rentals();
            $rental->account_id = $account_id;
            $rental->rental_date = $request->input('rental_header.rental_date');
            $rental->subtotal = $request->input('rental_header.subtotal');
            $rental->gst = $request->input('rental_header.gst');
            $rental->is_complete = 0;
            $rental->save();

            $company_info = null;
            $company = Companies::find($account->company_id);
            if ($company) {
                $company_info = [
                    'company_id' => $company->company_id,
                    'company_name' => $company->company_name,
                    'company_phone' => $company->company_phone,
                    'company_address' => $company->address,
                    'first_name' => $account->first_name,
                    'last_name' => $account->last_name,
                    'email' => $account->email,
                    'phone_number' => $account->phone_number,
                ];
            }

            $rental_id = $rental->rental_id;

            foreach ($request->input('rental_details') as $detail) {
                $rental_detail = new RentalDetails();
                $rental_detail->rental_id = $rental_id;
                $rental_detail->equipment_id = $detail['serial_id'];
                $rental_detail->start_date = $detail['start_date'];
                $rental_detail->end_date = $detail['end_date'];
                $rental_detail->quantity = $detail['quantity'];
                $rental_detail->price = $detail['price'];
                $rental_detail->condition = $detail['condition'];
                $rental_detail->is_active = 1;
                $rental_detail->save();

                $rental_details_array[] = $rental_detail;
            }

            \DB::commit();

            // $email = new EmailRental($rental, $rental_details_array, $company_info);
            // $email->build();

            return response()->json(['message' => 'Rental created successfully', 'rental_id' => $rental_id], 201);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['message' => 'Failed to create rental', 'error' => $e->getMessage()], 500);
        }
    }

    public function getEquipmentSerialIdsWithStatus($equipment_id)
{
    try {
        $serials = DB::table('equipment_details')
            ->where('equipment_details.equipment_id', $equipment_id)
            ->join('equipment', 'equipment_details.equipment_id', '=', 'equipment.equipment_id')
            ->select(
                'equipment_details.serial_id',
                'equipment_details.status',
                'equipment.equipment_id',
                'equipment.equipment_name',
                'equipment_details.serial_number'
            )
            ->get();

        return response()->json($serials, 200, [], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
        \Log::error("Error fetching serials for equipment_id $equipment_id: " . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}
    
  }

