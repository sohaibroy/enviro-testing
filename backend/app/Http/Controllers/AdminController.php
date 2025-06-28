<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Admin;
use Exception;


class AdminController extends Controller
{
    // admin login method
    // public function login(Request $request)
    // {
    //     Log::info('Login request received', $request->all());
    //     try {
    //         $request->validate([
    //             'email' => 'required|email',
    //             'password' => 'required'
    //         ]);

    //         $admin = Admin::where('email', $request->email)->first();

    //         if (!$admin || !Hash::check($request->password, $admin->password)) {
    //             // Invalid credentials
    //             Log::warning('Invalid credentials', [
    //     'admin_found' => $admin !== null,
    //     'password_valid' => $admin ? Hash::check($request->password, $admin->password) : false,
    // ]);
    //             return response()->json(['error' => 'Invalid credentials.'], 401);
    //         }
    //     } catch (Exception $e) {
    //         // Invalid request format
    //         return response()->json(['error' => 'Invalid request format.'], 401);
    //     }

    //     // Authentication successful
    //     $token = $admin->createToken(strval($admin->admin_id) . "_admin_token", expiresAt:now()->addHour())->plainTextToken;
        
    //     // Retrieve expiration time from personal access token
    //     $expiresAt = $admin->tokens->last()->expires_at;
        
    //     $response = [
    //         'token' => $token,
    //         'expires_at' => $expiresAt->format('Y-m-d H:i:s') // Format expiration time as desired
    //     ];

    //     return response()->json($response);
    // }

      public function login(Request $request)
    {
        Log::info('Login request received', [
            'email' => $request->email,
            'password' => '[HIDDEN]', // never log raw passwords
        ]);

        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            $admin = Admin::where('email', $request->email)->first();

            if (!$admin || !Hash::check($request->password, $admin->password)) {
                Log::warning('Invalid credentials', [
                    'admin_found' => $admin !== null,
                    'password_valid' => $admin ? Hash::check($request->password, $admin->password) : false,
                ]);
                return response()->json(['error' => 'Invalid credentials.'], 401);
            }

            // Authentication successful
            $token = $admin->createToken(
                strval($admin->admin_id) . "_admin_token",
                expiresAt: now()->addHour()
            )->plainTextToken;

            $expiresAt = $admin->tokens->last()->expires_at;

            return response()->json([
                'token' => $token,
                'expires_at' => $expiresAt->format('Y-m-d H:i:s')
            ]);

        } catch (Exception $e) {
            Log::error('Exception during login', [
                'message' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Invalid request format.'], 401);
        }
    }

    // Admin logout method
    public function logout(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'message' => 'Something happened when logging out. Try again or clear cache and close window.'
            ], 401);
        }

        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}

