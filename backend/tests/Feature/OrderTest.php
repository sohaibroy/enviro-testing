<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Accounts;
use App\Models\Admin;
use App\Models\Orders;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class OrderTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
    
    public function test_customer_order()
    {
        // Retrieve an admin user from the database by admin_id
        $accountId = 6; // Replace 1 with the actual account_id you want to retrieve
        Log::info('Fetching account with ID: ' . $accountId);
    
        $account = Accounts::findOrFail($accountId);
        // Generate a Sanctum token for the user
        $token = $account->createToken('test-token')->plainTextToken;
        Log::info('Generated token: ' . $token);
    
        // Create sample data for the request payload
        $requestData = [
            "order_header" => [
                "order_date" => "2024-03-15",
                "total_amount" => 100.50,
                "gst" => 15.50,
                "subtotal" => 85.00
            ],
            "order_details" => [
                [
                    "turn_around_id" => 13,
                    "quantity" => 2,
                    "price" => 12.50,
                    "required_quantity" => 1,
                    "required_pumps" => 1,
                    "required_media" => 1,
                    "customer_comment" => "IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples IC is a sensitive technique suitable for trace-level analysis of sulfuric acid in environmental samples"
                ]
            ]
        ];
        Log::info('Request data: ' . json_encode($requestData));
    
        // Use the token to authenticate the request
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post('/api/orders/store', $requestData);
    
        Log::info('Response status code: ' . $response->status());
        Log::info('Response content: ' . $response->content());
    
        // Assert that the response status code is 201
        $response->assertStatus(201);
    }
    public function testStoreWalkinOrders()
    {
        // Prepare request data
        $requestData = [
            "order_header" => [
                "order_date" => "2024-03-15",
                "total_amount" => 100.50,
                "gst" => 15.50,
                "subtotal" => 85.00,
                "firstName" => 'Walkin ',
                "lastName" => 'Cust',
                "email" => 'w.cust@gmail.com', // Fixed the email address
                "phoneNumber" => '111-111-1111'
            ],
            "order_details" => [
                [
                    "turn_around_id" => 13,
                    "price" => 12.50,
                    "required_quantity" => 1,
                    "required_pumps" => 1,
                    "required_media" => 1,
                    "customer_comment" => "test."
                ]
            ]
        ];
    
        // Send a POST request
        $response = $this->post('api/orders/walk-in', $requestData);
    
        // Log response status and content
        Log::info('Response status code: ' . $response->status());
        Log::info('Response content: ' . $response->content());
    
        // Assertions
        $response->assertStatus(201);  // Check if the order was created successfully
        $response->assertJson(['message' => 'Order created successfully']);  // Optional: Check for a specific JSON response
    }
    public function test_extreme_order_details(): void 
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $company_id=1;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("api/orders");

        // Assert that the response status is 200 (OK)
        $response->assertStatus(200);

    }
    public function test_get_order_details()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $order_id= 3;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post("/api/orderdetails/{$order_id}");


        $response->assertStatus(200);
    }
    public function test_searchorder_detail(): void
    {
        $order_id=1;

        $response = $this->get("/api/orders/searchorderdetails/{$order_id}");

        $response->assertStatus(200);
    }
    // public function test_order_searchtool(): void
    // {
    //    $searchValue = 'Test';
    //     $response = $this->get("/api/orders/searchtool/{$searchValue}");

    //     $response->assertStatus(200);
    // }
    
}    
