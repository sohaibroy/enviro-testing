<?
namespace Tests\Feature;

use App\Models\Methods;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Admin;

class MethodTest extends TestCase
{

    /**
     * Test creating a method.
     *
     * @return void
     */
    public function test_create_method()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        // Create a new method data
        $methodData = [
            'method_name' => 'Test Method',
            'matrix' => 'Test Matrix',
            'media' => 'Test Media',
            'measurement' => 'Test Measurement',
            'sample_rate' => 'Test Sample Rate',
            'limit_of_quantification' => 'Test Limit of Quantification',
            'general_comments' => 'Test General Comments',
            'is_active' => true,
        ];
    
        // Replace {analyte_id} placeholder in the URL with the actual value
        $analyte_id = 27;
        $url = "api/method/create/{$analyte_id}";
    
        // Make a POST request to create a new method
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post($url, $methodData);
    
        // Assert that the response status is 201 (Created)
        $response->assertStatus(201);
    
        // Assert that the method was created in the database
        $this->assertDatabaseHas('methods', $methodData);
    }
    

    /**
     * Test updating a method.
     *
     * @return void
     */
    public function test_update_method()
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;
        
        // Create a method in the database
        $method = 23;

        // Define updated method data (expected by the API)
        $updatedDataAPI = [
            'analyte_id' => 27,
            'method_name_param' => 'Updated Method',
            'matrix_param' => 'Updated Matrix',
            'media_param' => 'Updated Media',
            'measurement_param' => 'Updated Measurement',
            'sample_rate_param' => 'Updated Sample Rate',
            'limit_of_quantification_param' => 'Updated Limit of Quantification',
            'general_comments_param' => 'Updated General Comments',
            'is_active_param' => 1,
        ];

        // Define updated method data (expected by the database)
        $updatedDataDB = [
            'analyte_id' => 27, // Assuming analyte_id is a column name
            'method_name' => 'Updated Method',
            'matrix' => 'Updated Matrix',
            'media' => 'Updated Media',
            'measurement' => 'Updated Measurement',
            'sample_rate' => 'Updated Sample Rate',
            'limit_of_quantification' => 'Updated Limit of Quantification',
            'general_comments' => 'Updated General Comments',
            'is_active' => 1, 
        ];

        // Make a PUT request to update the method
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->put("/api/method/update/{$method}", $updatedDataAPI);

        // Assert that the response status is 200 (OK)
        $response->assertStatus(200);

        // Assert that the method was updated in the database
        $this->assertDatabaseHas('methods', $updatedDataDB);
    }


    public function test_method_by_analyteid(): void 
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $analyte_id=27; // find a analyte in dB
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("api/methods/analyte/{$analyte_id}");

        // Assert that the response status is 200 (OK)
        $response->assertStatus(200);

    }
}
