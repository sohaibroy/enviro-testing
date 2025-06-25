<?php

namespace App\Http\Controllers;

use App\Mail\EstimateEmail;
use Illuminate\Http\Request;
use App\Models\Accounts;
use App\Models\Companies;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; 

class EstimateController extends Controller
{
    public function sendEstimateEmail(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();
        $login_account_id = $user->account_id;

        // Validate the incoming JSON data
        $validator = Validator::make($request->all(), [
            'order_header.order_date' => 'required|date',
            'order_header.total_amount' => 'required|numeric',
            'order_header.subtotal' => 'required|numeric',
            'order_header.gst' => 'required|numeric',
            'order_details.*.turn_around_id' => 'required|integer',
            'order_details.*.price' => 'required|numeric',
            'order_details.*.required_quantity' => 'required|integer|min:1',
            'order_details.*.required_pumps' => 'nullable|integer|max:11',
            'order_details.*.required_media' => 'nullable|integer|max:11',
            'order_details.*.customer_comment' => 'nullable|string|max:255',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error. Please correct the following and try again.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Build order and detail arrays from request
        $order = $request->input('order_header');
        $orderDetailsArray = $request->input('order_details');

        // Retrieve user/company info
        $account = Accounts::find($login_account_id);
        $company_info = null;

        if ($account) {
            $account_firstname = $account->first_name;
            $account_lastname = $account->last_name;
            $account_email = $account->email;

            $company = Companies::find($account->company_id);
            if ($company) {
                $company_info = [
                    'company_id' => $company->company_id,
                    'company_name' => $company->company_name,
                    'company_phone' => $company->company_phone,
                    'company_address' => $company->address,
                    'first_name' => $account_firstname,
                    'last_name' => $account_lastname,
                    'email' => $account_email,
                ];
            }
        }

        $estimateDetails = [];

        foreach ($orderDetailsArray as $detail) {
            $turnAroundId = $detail['turn_around_id'];

            // Query turn_around_times -> methods -> analytes to get extra fields
            $extraInfo = DB::table('turn_around_times')
                ->join('methods', 'turn_around_times.method_id', '=', 'methods.method_id')
                ->join('analytes', 'methods.analyte_id', '=', 'analytes.analyte_id')
                ->select(
                    'turn_around_times.turnaround_time',
                    'methods.method_name',
                    'analytes.analyte_name'
                )
                ->where('turn_around_times.turn_around_id', $turnAroundId)
                ->first();

            // Merge the additional fields back into this detail
            $detail['analyte_name']    = $extraInfo->analyte_name ?? null;
            $detail['method_name']     = $extraInfo->method_name ?? null;
            $detail['turnaround_time'] = $extraInfo->turnaround_time ?? null;

            $estimateDetails[] = $detail;
        }

        try {
            // Send the email
            Mail::to($company_info['email'], $company_info['first_name'].' '.$company_info['last_name'])
            ->send(new EstimateEmail($order, $estimateDetails, $company_info));

            return response()->json(['message' => 'Estimate sent successfully'], 200);
        }  
        catch (\Exception $e) {
            Log::error('Failed to send estimate: ' . $e->getMessage());
            if (config('app.debug')) {
                return response()->json([
                    'message' => 'An error occurred',
                    'errorDetails' => $e->getMessage() 
                ], 500);
            }
            return response()->json([
                'message' => 'Failed to send estimate', 
                'error' => $e->getMessage()
            ], 500);
        }
    }
}