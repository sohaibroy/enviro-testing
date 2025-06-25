<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Accounts;

class LogInOutTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
    public function test_login_account()
    {
        $adminId = 10; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Accounts::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->post('api/login/account',[
            'email'=>'b@gmail.com',
            'password'=>'password',
        ]);

        $response->assertStatus(200)
        ->assertJsonStructure([
            'token',
            'user',
            'company_name',
            'expires_at'
        ]);
    }
    public function test_login_admin()
    {
        $response = $this->post('api/login/admin',[
            'email'=>'admin@gmail.com',
            'password'=>'password',
        ]);

        $response->assertStatus(200)
        ->assertJsonStructure([
            'token',
            'expires_at',
        ]);
    }
    public function test_logout_account()
    {
        // Assuming you have already logged in and obtained a valid token
        $user = Accounts::factory()->create();

        // Generate a Sanctum token for the user
        $token = $user->createToken('test-token')->plainTextToken;
        // Make a POST request to the logout endpoint
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post('api/logout');

        // Assert that the response status is 200 (OK)
        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Logged out successfully'
                ]);
    }
}