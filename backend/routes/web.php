<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MailController;
use App\Http\Controllers\EstimateController;
use App\Http\Controllers\OrdersController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\AccountsController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Test email the demo email
//Route::get('/send-demo-email', [MailController::class, 'sendDemoEmail']);
// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/test-db', function () {
    return DB::table('accounts')->get();
});

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

Route::get('/api/get-order', function (Request $request) {
    $orderId = $request->query('order_id');

    $order = \DB::table('orders')
        ->where('order_id', $orderId)
        ->first();

    if (!$order) return response()->json(['error' => 'Order not found'], 404);

    $details = \DB::table('order_details')
        ->where('order_id', $orderId)
        ->get();

    return response()->json([
        'id' => $order->order_id,
        'order_date' => $order->order_date,
        'subtotal' => $order->subtotal,
        'payment_status' => $order->payment_status ?? 'pending',
        'details' => $details,
    ]);
});


Route::middleware('web')->group(function () {
    //keep the exact same path your frontend calls
    Route::post('/api/login/account', [AccountsController::class, 'login']);
    Route::post('/login/admin', [AdminController::class, 'login']);
});

