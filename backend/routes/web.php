<?php

file_put_contents(storage_path('logs/web_routes_loaded.txt'), "Web routes loaded\n", FILE_APPEND);

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MailController;
//use App\Http\Controllers\EstimateController; -->

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
// Route::get('/send-demo-email', [MailController::class, 'sendDemoEmail']);
// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/env-check', function () {
    return [
        'env' => env('APP_ENV'),
        'debug' => config('app.debug'),
        'key_set' => config('app.key') ? true : false,
    ];
});

Route::get('/', function () {
    return 'Welcome - Route is working!';
});

