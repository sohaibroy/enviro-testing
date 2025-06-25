<?php

namespace App\Http\Controllers;

use App\Mail\OrderCompleted;
use App\Mail\DemoEmail;
use App\Mail\EmailContact;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

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
        Log::info('Start of sendContactEmail function');
        $first_name = $request->input('first_name');
        $last_name = $request->input('last_name');
        $email = $request->input('email');
        $phone = $request->input('phone_number');
        $city = $request->input('city');
        $state = $request->input('province_state');
        $message = $request->input('message');

        Log::info('Variables set');
        Mail::to('1029jmla.fry@gmail.com')->send(new EmailContact($first_name, $last_name, $email, $phone, $city, $state, $message));
        Log::info('Email sent');
        return response()->json(['message' => 'Email sent successfully!'], 200);
    }
}
