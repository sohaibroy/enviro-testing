<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Accounts;
use App\Models\Companies;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AccountsController extends Controller
{
    public function me(Request $request)
{
    $user = $request->user();

    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    // Use the correct singular relationship
    // $user->load('company');

     // If user is not Admin, load company relationship 
    if ($user instanceof \App\Models\Accounts) {   //ADDED THIS LINE FOR TESTING ON RENDER
        $user->load('company');
    }

    // return response()->json([
    //     'account_id'     => $user->account_id,
    //     'first_name'     => $user->first_name,
    //     'last_name'      => $user->last_name,
    //     'email'          => $user->email,
    //     'phone_number'   => $user->phone_number,
    //     'street_address' => $user->street_address,
    //     'city'           => $user->city,
    //     'province'       => $user->province,
    //     'postal_code'    => $user->postal_code,
    //     'country'        => $user->country,
    //     'company_id'     => $user->company_id,
    //     'company_name'   => optional($user->company)->company_name,
    //     'is_active'      => $user->is_active,
    // ]);

    return response()->json([
    'id'             => $user->account_id ?? $user->admin_id,
    'first_name'     => $user->first_name,
    'last_name'      => $user->last_name,
    'email'          => $user->email,
    'phone_number'   => $user->phone_number ?? null,
    'street_address' => $user->street_address ?? null,
    'city'           => $user->city ?? null,
    'province'       => $user->province ?? null,
    'postal_code'    => $user->postal_code ?? null,
    'country'        => $user->country ?? null,
    'company_id'     => $user->company_id ?? null,
    'company_name'   => $user instanceof \App\Models\Accounts
        ? optional($user->company)->company_name
        : null,
    'is_active'      => $user->is_active ?? true,
    'role'           => $user instanceof \App\Models\Admin ? 'admin' : 'account',
]);
}

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);
    
            $account = Accounts::where('email', $request->email)->first();
    
            if (!$account || !Hash::check($request->password, $account->password)) {
                // Invalid credentials
                return response()->json(['error' => 'Invalid credentials.'], 401);
            }
        // Get the company_id associated with the account
        $companyId = $account->company_id;

        // Retrieve the company name from the companies table
        $companyName = Companies::where('company_id', $companyId)->value('company_name');
    
        } catch (Exception $e) {
            // Invalid request format
            return response()->json(['error' => 'Invalid request format.'], 401);
        }
    
        // Authentication successful
        $token = $account->createToken(strval($account->account_id) . "_account_token", expiresAt:now()->addHour())->plainTextToken;
        
        // Retrieve expiration time from personal access token
        $expiresAt = optional($account->tokens->last())->expires_at;
    
        $response = [
            'token' => $token,
            'user' => [
                'first_name' => $account->first_name,
                'last_name' => $account->last_name,
                'email' => $account->email,
                'phone_number' => $account->phone_number,
                'street_address' => $account->street_address,
                'city' => $account->city,
                'province' => $account->province,
                'postal_code' => $account->postal_code,
                'country' => $account->country,
                'credit_card' => $account->credit_card,
                'job_title' => $account->job_title
            ],
            'company_name' => $companyName,
            'expires_at' => $expiresAt->format('Y-m-d H:i:s') 
        ];
        
        return response()->json($response);
    }


    public function index()
    {
        $user= Auth::user();
        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } else{   
        $customers = Accounts::all();
        return response()->json($customers);
        }
    }
    public function show($id)
    {
        $user= Auth::user();

        if (strpos($user, 'admin') === false) {

            return response()->json(['message' => 'You are not authorized to view this page'], 401);

        } else {
            
            $customer = Accounts::findOrFail($id);

            if (!$customer) {
                return response()->json(['message' => 'Account not found'], 404);
            }
    
            return response()->json($customer);
         }
      
    }

    // Create a new customer
    public function createAccount(Request $request)
    {
        $user= Auth::user();
        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } else{   
            $validator = Validator::make($request->all(), [
                'company_id'=>'required|integer|min:1',
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'password' => 'required|string|min:6',
                'email' => 'required|string|email|max:255|unique:accounts,email',
                'phone_number' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }
            try {
                // Create the customer
                $accounts = new Accounts();
                $accounts->company_id= $request->input('company_id');
                $accounts->first_name = $request->input('first_name');
                $accounts->last_name = $request->input('last_name');
                $accounts->email = $request->input('email');
                $accounts->phone_number = $request->input('phone_number');
                $accounts->password = Hash::make($request->input('password')); // Hash the password
                $accounts->is_active = $request->input('is_active', 1);
                $accounts->save();

                return response()->json(["message" => "Account Created"] , 201);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to create customer: ' . $e->getMessage()], 500);
            }
        }
    }

    // Sign-Up (if the user is on guest mode)
    public function signup(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'company_id' => 'nullable|integer|min:1',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'password' => 'required|string|min:6',
            'email' => 'required|string|email|max:255|unique:accounts,email',
            'phone_number' => 'nullable|string|max:20',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'credit_card' => 'nullable|string|min:13|max:19',
            'job_title' => 'nullable|string|max:255'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        try {
            // Create a new account
            $accounts = new Accounts();
            $accounts->company_id = $request->input('company_id', 1); 
            $accounts->first_name = $request->input('first_name');
            $accounts->last_name = $request->input('last_name');
            $accounts->email = $request->input('email');
            $accounts->phone_number = $request->input('phone_number');
            $accounts->password = Hash::make($request->input('password')); // Hash the password
            $accounts->is_active = 1; // Default to active
            $accounts->street_address = $request->input('street_address');
            $accounts->city = $request->input('city');
            $accounts->province = $request->input('province');
            $accounts->postal_code = $request->input('postal_code');
            $accounts->country = $request->input('country');
            $accounts->credit_card = $request->input('credit_card');
            $accounts->job_title = $request->input('job_title');
            $accounts->save();
    
            return response()->json(["message" => "Account Created Successfully"], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create account: ' . $e->getMessage()], 500);
        }
    }
    
    
    public function updateAccount(Request $request, $id)
    {
        $user = Auth::user();
        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }
    
        if (!$user || ($user->role !== 'admin' && $user->account_id != $id)) {
            return response()->json(['message' => 'You are not authorized to update this account'], 401);
        }

        // Validate incoming data
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'password' => 'nullable|string|min:6',
            'email' => 'required|string|email|max:255|unique:accounts,email,'.$id.',account_id',
            'phone_number' => 'nullable|string|max:20',
            'is_active'=> 'required|boolean',
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'credit_card' => 'nullable|string|min:13|max:19',
            'job_title' => 'nullable|string|max:255'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        // Check if the account exists
        $customer = DB::table('accounts')->where('account_id', $id)->first();
        if (!$customer) {
            return response()->json(['message'=>'Account not found'], 404);
        }
    
        // Check if the associated company is inactive and the request attempts to activate the account
        $company = DB::table('accounts')
            ->join('companies', 'accounts.company_id', '=', 'companies.company_id')
            ->where('accounts.account_id', $id)
            ->select('companies.is_active')
            ->first();
    
        if (!$company) {
            // Handle the case where no associated company record is found
            return response()->json(['message'=>'Associated company not found'], 404);
        }
    
        $is_active_int = (int)$request->input('is_active');// need to change string to int for business logic
    
        if ($company->is_active === 0 && $is_active_int=== 1) {
            return response()->json(['message'=>'Cannot activate account while company is inactive'],400);
        }
    
        // Update customer data using DB::table
        $password =!empty($request->input('password'))? bcrypt($request->input('password')) : $customer->password;
        DB::table('accounts')
            ->where('account_id', $id)
            ->update([
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'password' => $password,
                'email' => $request->input('email'),
                'phone_number' => $request->input('phone_number'),
                'is_active' => $request->input('is_active'),
                'street_address' => $request->input('street_address'),
                'city' => $request->input('city'),
                'province' => $request->input('province'),
                'postal_code' => $request->input('postal_code'),
                'country' => $request->input('country'),
                'credit_card' => $request->input('credit_card'),
                'job_title' => $request->input('job_title')
            ]);
    
        // Retrieve the updated customer
        $customer = DB::table('accounts')->where('account_id', $id)->first();
    
        // Return the updated customer with a 200 status code
        return response()->json(['message'=>$customer], 200);
    }
    
    public function getAccountsByCompanyId($company_id)
    {
        $user = Auth::user();
        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }
        // Search for accounts by company_id
        $accounts = Accounts::where('company_id', $company_id)->get();
    
        // Return JSON response with accounts data
        return response()->json($accounts, 200);
    }
}
