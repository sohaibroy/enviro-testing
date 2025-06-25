<?
use App\Models\Companies;
use App\Models\Accounts;
use App\Models\Admin;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CompaniesTest extends TestCase
{

    /**
     * Test creating a company.
     */
    public function test_create_company(): void
    {        
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        // Use the token to authenticate the request
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post('/api/company/create', [
            'company_name' => 'Test Company',
            'company_phone' => '123456789',
            'address' => '123 Test St',
            'is_active' => true,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('companies', [
            'company_name' => 'Test Company',
            'company_phone' => '123456789',
            'address' => '123 Test St',
            'is_active' => true,
        ]);
    }

    /**
     * Test updating a company.
     */
    public function test_update_company(): void
    {
        
        // Create a company in the database
        $company = Companies::factory()->create([
            'company_name' => 'Initial Company',
            'company_phone' => '987654321',
            'address' => '456 Initial St',
            'is_active' => true,
        ]);

            // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        // Use the token to authenticate the request
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->put("/api/company/update/{$company->company_id}", [
            'company_name' => 'Updated Company',
            'company_phone' => '555555555',
            'address' => '789 Updated St',
            'is_active' => false,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('companies', [
            'company_id' => $company->company_id,
            'company_name' => 'Updated Company',
            'company_phone' => '555555555',
            'address' => '789 Updated St',
            'is_active' => false,
        ]);
    }
    /**
     * Test show all companies
     */
    public function test_show_all_companies():void
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("/api/companies");

        $response->assertStatus(200);
    }
        /**
     * Test show all companies
     */
    public function test_get_company_by_company_id():void
    {
        // Retrieve an admin user from the database by admin_id
        $adminId = 1; // Replace 1 with the actual admin_id you want to retrieve
        $admin = Admin::findOrFail($adminId);
        // Generate a Sanctum token for the user
        $token = $admin->createToken('test-token')->plainTextToken;

        $company_id =1;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get("/api/company/{$company_id}");

        $response->assertStatus(200);
    }
    public function test_companie_search(): void
    {
        $searchTerm='walk';

        $response = $this->get("/api/company/search/{$searchTerm}");

        $response->assertStatus(200);
    }
}
