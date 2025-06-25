<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Categories;
use App\Models\Synonyms;
use Tests\TestCase;

class SynonymsTest extends TestCase
{

    public function testCreateSynonymSuccessfully()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;
        
        $category_id=12; // change according to the db
        // Define the data for creating a synonym
        $synonymData = [
            'synonym' => 'Test Synonym',
            // Add other necessary fields here
        ];
    
        // Make an API call to create a new Synonym
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post("/api/synonym/create/{$category_id}", $synonymData);
    
        // Assert the response status code is 201
        $response->assertStatus(200);
    }
    
    public function testDeleteSynonymSuccessfully()
    {
        // Assuming you have an admin user with ID 1
        $admin = Admin::find(1);
        $token = $admin->createToken('test-token')->plainTextToken;
    
        // Create a Category instance
        $category = new Categories();
        $category->category_name = 'Test Category';
        $category->technique = 'Test Technique';
        $category->is_active=true;
        $category->save();
    
        // Create a Synonym instance
        $synonym = new Synonyms();
        $synonym->category_id = $category->id;
        $synonym->synonym = 'Test Synonym';
        $synonym->save();
    
        // Make a DELETE request to delete the Synonym
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->delete("/api/synonym/delete/{$synonym->synonym_id}");
    
        // Assert the response status code is 200
        $response->assertStatus(200);
    
        // Assert the response content
        $response->assertJson([
            'message' => 'You have successfully deleted a synonym'
        ]);
    
        // Assert the Synonym is deleted from the database
        $this->assertDatabaseMissing('synonyms', ['synonym_id' => $synonym->id]);
    }
    public function test_get_all_synonyms()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $category_id= 3;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("/api/synonyms/{$category_id}");


        $response->assertStatus(200);
    }
}
