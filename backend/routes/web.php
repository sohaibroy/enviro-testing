<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MailController;
use App\Http\Controllers\EstimateController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

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

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_cookie' => true]);
});


