<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Admin;

class TurnAroundTimeTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
    public function test_set_turnaroundtime()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $method_id= 13;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post("/api/turnaroundtimes/set/{$method_id}");

        $response->assertStatus(200);
    }
    public function test_get_tat_by_methodid()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $method_id= 13;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("/api/turnaroundtimes/{$method_id}");

        $response->assertStatus(200);
    }
    public function test_get_turnaroundtimes(): void
    {
        $methodId = 13;

        // Log the methodId before making the API request
        \Log::info("Requesting turnaround times for methodId: $methodId");

        $response = $this->get("/api/turn-around-times/{$methodId}");

        // Log the response status code after receiving the response
        \Log::info("Response status code: " . $response->getStatusCode());

        $response->assertStatus(200);
    }

}
