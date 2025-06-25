<?
namespace Tests\Feature;

use App\Models\Categories;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Admin;

class CategoryTest extends TestCase
{

    /**
     * Test creating a category.
     *
     * @return void
     */
    public function test_create_category()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        // Create a new category data
        $categoryData = [
            'category_name' => 'Test Category',
            'technique' => 'Test Technique',
            'is_active' => true,
        ];
    
        // Replace {analyte_id} placeholder in the URL with the actual value
        $analyte_id = 27;
        $url = "api/category/create/{$analyte_id}";
    
        // Make a POST request to create a new category
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post($url, $categoryData);
    
        // Assert that the response status is 201 (Created)
        $response->assertStatus(201);
    
        // Assert that the category was created in the database
        $this->assertDatabaseHas('categories', $categoryData);
    }
    

    /**
     * Test updating a category.
     *
     * @return void
     */
    // public function test_update_category()
    // {
    //           // Retrieve an admin user from the database by admin_id
    //     $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
    //     $admin = Admin::findOrFail($adminId);
    //     // Generate a Sanctum token for the user
    //     $token = $admin->createToken('test-token')->plainTextToken;
        
    //     // Create a category in the database
    //     $category = 23;

    //     // Define updated category data
    //     $updatedData = [
    //         'analyte_id' => 27, // Replace with an existing analyte ID
    //         'category_name' => 'Updated Category',
    //         'technique' => 'Updated Technique',
    //         'is_active' => 1,
    //     ];

    //     // Make a PUT request to update the category
    //     $response = $this->withHeaders([
    //         'Authorization' => 'Bearer ' . $token,
    //     ])->put("/api/category/update/{$category}", $updatedData);

    //     // Assert that the response status is 200 (OK)
    //     $response->assertStatus(201);

    //     // Assert that the category was updated in the database
    //     $this->assertDatabaseHas('categories', $updatedData);
    // }

    public function test_category_by_analyteid(): void 
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $analyte_id=27; // find a analyte in dB
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("api/categories/{$analyte_id}");

        // Assert that the response status is 200 (OK)
        $response->assertStatus(200);

    }
}
