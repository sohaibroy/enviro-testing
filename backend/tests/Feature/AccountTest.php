<?php

namespace Tests\Feature;

use App\Models\Accounts;
use App\Models\Admin;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AccountTest extends TestCase
{


    /**
     * Test creating an account.
     */
    public function test_create_account(): void
    {
            // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $newemail= 'test'.rand(1,1000).'@example.com';
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post('/api/account/create', [
            'company_id' => 1, // Replace with the actual company ID
            'first_name' => 'John',
            'last_name' => 'Doe',
            'password' => 'password123',
            'email' => $newemail,
            'phone' => '123456789',
        ]);

        // Assert that the response status is 201 (Created)
        $response->assertStatus(201);

    }

    /**
     * Test updating an account.
     */
    public function test_update_account(): void
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        // Create an account in the database
        $account = Accounts::factory()->create([
            'first_name' => 'Initial First Name',
            'last_name' => 'Initial Last Name',
            'email' => 'initial@example.com',
            'company_id'=>1,
            'first_name' =>'Updated Jester',
            'last_name'=>'Updated Long',
            'phone_number'=>'234-234-2344',
            // Add other required attributes
        ]);
        $newemail= 'test'.rand(1,1000).'@example.com';
        // Send a PUT request to update the account
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->put("/api/account/update/{$account->account_id}", [
            'company_id'=>1,
            'first_name' =>'Updated Jester',
            'last_name'=>'Updated Long',
            'phone_number'=>'234-234-2344',
            'email'=>$newemail,
            'is_active'=> true,
            // Add other attributes to update
        ]);

        // Assert that the response status is 200 (OK)
        $response->assertStatus(200);

    }
    public function test_get_account_by_company_id(): void 
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $company_id=1;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("api/accounts/{$company_id}");

        // Assert that the response status is 200 (OK)
        $response->assertStatus(200);

    }
}
