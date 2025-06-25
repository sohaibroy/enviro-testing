<?php

//use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
//use App\Http\Controllers\MailController;
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

Route::get('/debug-routes', function () {
    return response()->json([
        'base_path' => base_path(),
        'routes_folder' => scandir(base_path('routes')),
    ]);
});

file_put_contents(storage_path('logs/web_routes_loaded.txt'), "Routes file loaded at " . now() . "\n", FILE_APPEND);

Route::get('/', function () {
    return '✅ Route is working!';
});

Route::get('/debug-routes', function () {
    return response()->json([
        'base_path' => base_path(),
        'routes_folder' => scandir(base_path('routes')),
    ]);
});