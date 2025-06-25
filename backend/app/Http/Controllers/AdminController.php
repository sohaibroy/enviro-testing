<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Exception;


class AdminController extends Controller
{
    // admin login method
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            $admin = Admin::where('email', $request->email)->first();

            if (!$admin || !Hash::check($request->password, $admin->password)) {
                // Invalid credentials
                return response()->json(['error' => 'Invalid credentials.'], 401);
            }
        } catch (Exception $e) {
            // Invalid request format
            return response()->json(['error' => 'Invalid request format.'], 401);
        }

        // Authentication successful
        $token = $admin->createToken(strval($admin->admin_id) . "_admin_token", expiresAt:now()->addHour())->plainTextToken;
        
        // Retrieve expiration time from personal access token
        $expiresAt = $admin->tokens->last()->expires_at;
        
        $response = [
            'token' => $token,
            'expires_at' => $expiresAt->format('Y-m-d H:i:s') // Format expiration time as desired
        ];

        return response()->json($response);
    }

    // admin logout method
    public function logout(Request $request)
    {
        $user= Auth::user();
        if(!$user){
            return response()->json(['message' => 'Something happened when logging out, try again or clear cache and close window.'], 401);
        }
        // Revoke all tokens for the authenticated user
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
