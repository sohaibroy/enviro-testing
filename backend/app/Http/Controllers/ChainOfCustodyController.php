<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ChainOfCustody;

class ChainOfCustodyController extends Controller
{
    public function submit(Request $request)
    {
        // Validate the incoming JSON data
        $validator = Validator::make($request->all(), [
            'labClient'     => 'required|string|min:3|max:255',
            'date'          => 'required|date',
            'streetAddress' => 'required|string|min:5|max:255',
            'city'          => 'required|string|max:255',
            'province'      => 'required|string|max:255',
           'postalCode'    => ['required', 'string','regex:/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/'],
            'country'       => 'required|string|max:255',
            'contactName'   => 'required|string|max:255',
            'email'         => ['required','email','max:255','regex:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i'],
            'project'       => 'required|string|min:3|max:255',
            'phone'         => ['required','string','regex:/^\d{10}$/'],
            'fax'           => ['nullable','string','regex:/^\d{10}$/'],
            'poNumber'      => 'required|string|max:255',
            'creditCard'    => ['required','string','regex:/^\d{16}$/'],
            'expDate'       => ['required','string','regex:/^(0[1-9]|1[0-2])\/?([0-9]{2})$/'],
            'turnaround'    => 'required|string|max:255',
            'timeReceived'  => 'required|string|max:255',
            'signature'     => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error. Please correct the following and try again.',
                'errors'  => $validator->errors(),
            ], 422);
        }
        // used for debugging
        //\Log::info('Validation passed. Data:', $request->all());

        // Send the Chain of Custody email
        try {
            $formData = $request->all();
            
            Mail::to(env('MAIL_TO'))->send(new ChainOfCustody($formData));

            return response()->json(['message' => 'COC submitted successfully']);
        } catch (\Exception $e) {
            Log::error('COC Submission Error: ' . $e->getMessage());
            if (config('app.debug')) {
                return response()->json([
                    'message' => 'An error occurred',
                    'errorDetails' => $e->getMessage() 
                ], 500);
            }
            return response()->json([
                'message' => 'Failed to submit COC',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
