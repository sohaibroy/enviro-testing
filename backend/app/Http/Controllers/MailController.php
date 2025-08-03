<?php

namespace App\Http\Controllers;

use App\Mail\OrderCompleted;
use App\Mail\DemoEmail;
use App\Mail\EmailContact;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Mail\ContactFormToCompanyMail;
use App\Mail\ContactFormToCustomerMail;

class MailController extends Controller
{
//    public function sendEmail(Request $request)
//    {
//        $user = $request->user(); //user associated with order
//       $order = $request->order; //order details available
//       Mail::to($user->email)->send(new OrderCompleted($order));
//
//        return "Email sent successfully!"; // Return response or redirect
//    }
    public function sendDemoEmail()
    {
        $title = 'Demo Email';
        $body = 'please please please work';

        Mail::to('victodern@gmail.com')->send(new DemoEmail($title, $body));

        return "Email sent successfully!";
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendContactEmail(Request $request)
{

    try {
        // Validate input
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'phone_number' => 'nullable|string',
            'city' => 'nullable|string',
            'province_state' => 'nullable|string',
            'message' => 'required|string',
        ]);

        $fullName = $validated['first_name'] . ' ' . $validated['last_name'];

        // Send to company
        Mail::to('roysohaib@hotmail.com')->send(new ContactFormToCompanyMail($validated));

        // Send confirmation to customer
        Mail::to($validated['email'])->send(new ContactFormToCustomerMail($fullName));

        return response()->json(['message' => 'Emails sent successfully!'], 200);

    } catch (\Throwable $e) {
        Log::error('[ContactForm] Error sending contact email: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json(['message' => 'Failed to send contact email.'], 500);
    }
}
}
