<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Admin;
use Illuminate\Support\Facades\DB;

class PriceOverrideTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
    public function test_get_priceoverride_or_default()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        // Assuming company_id and method_id for testing
        $company_id = 1;
        $method_id = 1;

        // Make a GET request to the controller method
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("/api/priceoverride/{$company_id}/{$method_id}");

        // Assert the response status code is 200
        $response->assertStatus(200);
        
    }
    public function test_reset_customer_pricing()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        // Assuming company_id and method_id for testing
        $company_id = 1;

      // Make a GET request to the controller method
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("/api/priceoverride/reset/{$company_id}");

        // Assert the response status code is 200
        $response->assertStatus(200);
        
    }

}
