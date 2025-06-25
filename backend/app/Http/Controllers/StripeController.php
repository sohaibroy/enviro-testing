<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// Manually load the Stripe SDK
require_once base_path('stripe-php-17.3.0/init.php'); // path to init.php file in the stripe php

class StripeController extends Controller
{
    public function create(Request $request)
    {
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET')); // set in the .env file

        $amount = $request->input('amount'); // Amount in cents (example 10 dollar like 1000)

        try {
            $intent = \Stripe\PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'cad', // Use 'cad' for Canadian dollars
                'automatic_payment_methods' => ['enabled' => true],
            ]);

            return response()->json(['clientSecret' => $intent->client_secret]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}