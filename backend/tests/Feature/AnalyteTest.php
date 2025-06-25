<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Admin;
use App\Models\Analytes;

class AnalyteTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
        /**
     * A basic feature test example.
     */
    public function test_get_all_analytes(): void
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("api/analytes");


        $response->assertStatus(200);
    }
    public function test_update_analyte()
    {
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $num=10; //analyteId
        // Define the update data
        $updateData = [
            'analyte_name' => 'Updated Analyte Name',
            'cas_number' => '123-45-6',
            'is_active' => 1,
        ];

        // Make PUT request to update the analyte
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->put("/api/analyte/update/{$num}", $updateData);

        // Assert that the response status is 200 (OK)
        $response->assertStatus(200);
    }

    public function test_create_analyte()
    {        
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;
 
        // Use the token to authenticate the request
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post('/api/analyte/create', [
            'analyte_name' => 'Test Analyte',
            'cas_number' => '123-4567',
            'is_active' => true,
           
        ]);
 
        $response->assertStatus(200);
    }

    public function test_search_analyte(): void
    {
        $searchValue="lead";
        $response = $this->post("/api/analyte/search/{$searchValue}");

        $response->assertStatus(200);
    }
    public function test_get_active_analytes(): void
    {
        $response = $this->get("/api/analytes/active");

        $response->assertStatus(200);
    }
    public function test_get_analyte(): void
    {
        $analyte_id=27;

        $response = $this->get("/api/analyte/{$analyte_id}");

        $response->assertStatus(200);
    }
    public function test_searchtool(): void
    {

        $dataPayload=[
            'searchValue'=>'lead',
            'searchType'=>'Contains',
        ];
        $response = $this->post("/api/analyte/searchtool",$dataPayload);

        $response->assertStatus(200);
    }
    
}
