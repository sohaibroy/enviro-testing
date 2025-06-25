<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Admin;

class MethodsTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
    public function test_methodsearch(): void
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $analyte_id=27; //find a id in the db
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("/api/methods/analyte/{$analyte_id}");

        $response->assertStatus(200);
    }
    public function test_create_method(): void
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        // Define method data
        $methodData = [
        'method_name' => 'Test Method',
        'matrix' => 'Test Matrix',
        'media' => 'Test Media',
        'measurement' => 'Test Measurement',
        'sample_rate' => 'Test Sample Rate',
        'limit_of_quantification' => 'Test Limit of Quantification',
        'general_comments' => 'Test General Comments',
        ];

        $analyte_id=27; //find a id in the db
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post("/api/method/create/{$analyte_id}",$methodData);

        $response->assertStatus(201);
    }
    public function test_update_method(): void
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        // Define method data
        $methodData = [
        'method_name_param' => 'Test Method',
        'matrix' => 'Test Matrix',
        'media' => 'Test Media',
        'measurement' => 'Test Measurement',
        'sample_rate' => 'Test Sample Rate',
        'limit_of_quantification' => 'Test Limit of Quantification',
        'general_comments' => 'Test General Comments',
        'is_active_param'=> 1,
        ];

        $analyte_id=27; //find a id in the db
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->put("/api/method/update/{$analyte_id}",$methodData);

        $response->assertStatus(200);
    }
    public function test_get_method_by_analyte_pricing(): void
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $analyte_id=27; //find a id in the db
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("api/methods/company/{$analyte_id}");

        $response->assertStatus(200);
    }
    public function test_get_method_details(): void
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $method_id=27; //find a id in the db
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("api/method-details/company/{$method_id}");

        $response->assertStatus(200);
    }
    public function test_method_by_methodid(): void
    {
        $method_id= 13;

        $response = $this->get("/api/method/{$method_id}");

        $response->assertStatus(200);
    }
    public function test_method_by_analyteid(): void
    {
        $analyte_id= 27;

        $response = $this->get("/api/methods/{$analyte_id}");

        $response->assertStatus(200);
    }
    public function test_method_methodid_details(): void
    {
        $method_id= 13;

        $response = $this->get("/api/method-details/{$method_id}");

        $response->assertStatus(200);
    }
}
