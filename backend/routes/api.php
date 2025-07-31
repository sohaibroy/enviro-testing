<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;  //ADDED for testing
use App\Http\Controllers\AccountsController;
use App\Http\Controllers\AnalytesController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\MethodsController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\TurnAroundTimeController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\OrderDetailsController;
use App\Http\Controllers\SynonymsController;
use App\Http\Controllers\PriceOverRideController;
use App\Http\Controllers\RentalsController;
use App\Http\Controllers\RentalDetailsController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentValuesController;
use App\Http\Controllers\EquipmentAttributesController;
use App\Http\Controllers\EquipmentTypesController;
use App\Http\Controllers\GuestRentalController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\TransactionsController;
use App\Http\Controllers\EstimateController;
use App\Http\Controllers\ChainOfCustodyController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\MonerisController;
use App\Http\Controllers\ReturnEquipmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

//Extreme Route Order  
Route::get('/orders', [OrdersController::class, 'ExtremeOrderInfo']);

//Eqipment Return Route
Route::post('/equipment/return', [ReturnEquipmentController::class, 'returnEquipment']);

//Moneris Route
Route::post('/api/moneris/checkout', [MonerisController::class, 'startCheckout']);
Route::post('/api/moneris/callback', [MonerisController::class, 'handleCallback'])->name('moneris.callback');
Route::get('/orders/full/{order_id}', [OrdersController::class, 'getOrderWithDetails']);

//Stripe Route
Route::post('/create-payment-intent', [StripeController::class, 'create']);
Route::post('/create-checkout-session', [StripeController::class, 'createCheckoutSession']);
Route::post('/stripe/webhook', [StripeController::class, 'handleWebhook']);
Route::get('/stripe/session/{session_id}', [StripeController::class, 'getOrderIdFromSession']);


// Public Routes

// Emails the contact us form data
Route::post('/send-contact-email', [MailController::class, 'sendContactEmail']);

//Feedback Route
Route::post('/feedback', [FeedbackController::class, 'store']);

 // Create a new account (without any auth.)
 Route::post('signup/account', [AccountsController::class, 'signup']);

 // Update an existing account
//Route::put('/account/update/{account_id}', [AccountsController::class, 'updateAccount']); // Works

// Send Chain of Custody Email
Route::post('/submit-coc', [ChainOfCustodyController::class, 'submit']);

// Authentication Routes

Route::post('/login/account', [AccountsController::class, 'login']); // phpunit works
Route::post('/login/admin', [AdminController::class, 'login']); // phpunit works
Route::middleware('auth:sanctum')->post('/logout', [AdminController::class,'logout']); // phpunit works

// Route::post('/searchcustomer', [AccountsController::class, 'searchCustomer']); // works

// Use a single middleware declaration for all ADMIN ROUTES
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/send-estimate-email', [EstimateController::class, 'sendEstimateEmail']);
    // Get all companies
    Route::get('companies', [CompanyController::class, 'index']); // phpunit works

    // Create a new company
    Route::post('company/create', [CompanyController::class, 'createCompany']);// phpunit works

    // Update an existing company
    Route::put('company/update/{company_id}', [CompanyController::class, 'updateCompany']);// phpunit works

    // Get a company by ID
    Route::get('company/{company_id}', [CompanyController::class, 'getCompanyByCompanyId']); // phpunit works

    //Get accounts by companyid
    Route::get('/accounts/{company_id}',[AccountsController::class, 'getAccountsByCompanyId']); // phpunit works

    // Create a new account
    Route::post('/account/create', [AccountsController::class, 'createAccount']); // phpunit works

    // Update an existing account
    Route::put('/account/update/{account_id}', [AccountsController::class, 'updateAccount']);// phpunit works

    // Get all analytes (For admin only)
    Route::get('/analytes', [AnalytesController::class, 'index']); // phpunit works

    // Create a new analyte
    Route::post('/analyte/create',[AnalytesController::class, 'createAnalyte']); //phpunit

    // Update an existing analyte
    Route::put('/analyte/update/{analyte_id}',[AnalytesController::class, 'updateAnalyte']); // phpunit works

    // Category Route
    Route::post('/category/create/{analyte_id}',[CategoriesController::class, 'createCategory']);// works
    Route::put('/category/update/{category_id}',[CategoriesController::class, 'updateCategory']); // phpunit works
    Route::get('/categories/{analyte_id}', [CategoriesController::class, 'getCategoriesByAnalyteID']); // phpunit works

    // Equipment
    Route::get('/equipment', [EquipmentController::class, 'index']);
    Route::get('/equipment/search', [EquipmentController::class, 'searchEquipment']);
    Route::get('/equipment/{equipment_id}', [EquipmentController::class, 'show']);
    Route::post('/equipment/create', [EquipmentController::class, 'createEquipment']);
    Route::put('/equipment/update/{equipment_id}', [EquipmentController::class, 'updateEquipment']);
    Route::get('/equipment/{equipment_id}/serials', [RentalsController::class, 'getEquipmentSerialIdsWithStatus']);

    Route::delete('/equipment/{equipment_id}', [EquipmentController::class, 'deleteEquipment']);

    // Equipment Types
    Route::post('/equipment-types/create', [EquipmentTypesController::class, 'createEquipmentType']);
    Route::put('/equipment-types/update/{equipment_type_id}', [EquipmentTypesController::class, 'updateEquipmentType']);

    // Equipment Attributes
    Route::post('/equipment-attributes/create', [EquipmentAttributesController::class, 'createAttribute']);
    Route::put('/equipment-attributes/update', [EquipmentAttributesController::class, 'updateAttribute']);
    Route::post('/equipment-attributes/create-or-update', [EquipmentAttributesController::class, 'createOrUpdateAttributes']);

    // Equipment Values
    Route::post('/equipment-values/create', [EquipmentValuesController::class, 'createEquipmentValue']);
    Route::put('/equipment-values/update', [EquipmentValuesController::class, 'updateEquipmentValue']);

    // Synonyms
    Route::post('/synonym/create/{category_id}',[SynonymsController::class, 'createSynonym']); // phpunit works
    Route::delete('/synonym/delete/{synonym_id}',[SynonymsController::class,'deleteSynonyms']);//  phpunit works
    Route::get('/synonyms/{category_id}',[SynonymsController::class,'index']); //phpunit works

    // Methods
    Route::get('/methods/analyte/{analyte_id}', [MethodsController::class, 'searchMethodByAnalyteId']); //phpunit works
    Route::post('/method/create/{analyte_id}', [MethodsController::class, 'createMethod']); //phpunit works
    Route::put('/method/update/{method_id}', [MethodsController::class, 'updateMethod']); // phpunit works
    Route::get('/methods/company/{analyte_id}', [MethodsController::class, 'getMethodsByAnalyteIdPricing']); //phpunit works
    Route::get('/method-details/company/{method_id}', [MethodsController::class, 'getMethodByMethodIdPricing']); // phpunit works

    // Price Overrides
    Route::get('/priceoverride/{company_id}/{method_id}', [PriceOverRideController::class, 'getPriceOverrideOrDefaultPrice']); //phpunit works
    Route::post('priceoverride/reset/{company_id}', [PriceOverRideController::class, 'resetCustomerPricing']);//phpunit works

    // Orders
    //Route::get('/orders', [OrdersController::class, 'ExtremeOrderInfo']); // phpunit works
    Route::put('/order/update/{order_id}', [OrdersController::class, 'updateOrders']); //---cant get phpunit to work

    // Order Details
    Route::post('/orderdetails/{order_id}', [OrderDetailsController::class, 'GetOrderDetails']); //phpunit works

    // Rentals
    Route::get('/rentals', [RentalsController::class, 'ExtremeRentalInfo']);
    Route::put('/rentals/update/{rental_id}', [RentalsController::class, 'updateRentals']);

    // Rental Details
    Route::get('/rentaldetails/{rental_id}', [RentalDetailsController::class, 'getRentalDetailsByRentalID']);

    // Transactions
    Route::get('transactions', [TransactionsController::class, 'getAllTransactionsWithRelatedTables']);
    Route::put('transactions/update/{transaction_id}', [TransactionsController::class, 'updateTransaction']);
    Route::get('transactions/search/{searchValue}', [TransactionsController::class, 'searchTransactions']);

    // Turn Around Times
    Route::post('/turnaroundtimes/set/{method_id}', [TurnAroundTimeController::class, 'setAllTurnAroundTimes']);// phpunit works
    Route::get('/turnaroundtimes/{method_id}', [TurnAroundTimeController::class, 'getTurnAroundTimesByMethodId']);// phpunit works

    //added equipment data route as it was not protected
    Route::get('/equipment-data', [EquipmentController::class, 'getAllEquipment']);

    // Auth
    //Route::middleware('auth:sanctum')->get('/account/me', [AccountsController::class, 'me']);
    Route::get('/account/me', [AccountsController::class, 'me']);

});

// Search for a company by name --works
Route::get('company/search/{searchTerm}', [CompanyController::class, 'searchCompanyByName']);//phpunit works

Route::post('/analyte/search/{searchValue}',[AnalytesController::class, 'searchAnalyte']);//phpunit works

Route::get('/analytes/active', [AnalytesController::class, 'getActiveAnalytes']); // phpunit works
Route::get('/analyte/{analyte_id}', [AnalytesController::class, 'show']);//phpunit works

Route::post('/analyte/searchtool/',[AnalytesController::class, 'searchTool']);// phpunit works

// Equipment Routes
Route::get('/equipment-data', [EquipmentController::class, 'getAllEquipment']);
Route::get('/equipment/active', [EquipmentController::class, 'getActiveEquipment']); // static route
Route::get('/equipment/by-type/{equipmentTypeID}', [EquipmentController::class, 'getEquipmentByEquipmentTypeID']); // static route with param
Route::get('/public/equipment/{equipment_id}/serials', [RentalsController::class, 'getEquipmentSerialIdsWithStatus']);

Route::get('/equipment/{equipment_id}', [EquipmentController::class, 'show']);
// Equipment Types Routes
Route::get('/equipment-types', [EquipmentTypesController::class, 'index']);
Route::get('/equipment-types/{equipment_type_id}', [EquipmentTypesController::class, 'getEquipmentTypeByID']);

// Equipment Attributes Routes
Route::get('/equipment-attributes/{attribute_id}', [EquipmentAttributesController::class, 'getAttributeByID']);
Route::get('/equipment-attributes/{equipment_type_id}', [EquipmentAttributesController::class, 'getAttributeByEquipmentTypeID']);

// Equipment Values Routes
Route::get('/equipment-values/{equipment_id}', [EquipmentValuesController::class, 'getEquipmentValuesByEquipmentID']);

// Methods Route
Route::get('/method/{method_id}', [MethodsController::class, 'showMethodByMethodId']); //phpunit work
Route::get('/methods/{analyte_id}', [MethodsController::class, 'getMethodsByAnalyteId']); //phpunit work
Route::get('/method-details/{method_id}', [MethodsController::class, 'getMethodByMethodId']);//phpunit works

Route::get('/quantity-details/{method_id}', [MethodsController::class, 'getMethodByMethodId']);

// Orders Routes
Route::get('/orders/searchorderdetails/{order_id}', [OrdersController::class, 'show']);// phpunit walk
Route::get('/orders/searchtool/{searchTerm}', [OrdersController::class, 'searchOrderTool']);// phpunit works

// Rentals Routes
Route::get('/rentals/searchrentals/{rental_id}', [RentalsController::class, 'show']);
Route::get('/rentals/searchtool/{searchValue}', [RentalsController::class, 'searchRentalTool']);

// Transactions Routes
Route::post('/transactions/create', [TransactionsController::class, 'createTransaction']);
Route::post('/transactions/guest', [TransactionsController::class, 'createTransaction']);
// Turnaroundtime Routes
Route::get('/turn-around-times/{methodId}', [TurnAroundTimeController::class, 'getTurnAroundTimes']);//phpunit works

//Create Order Route
Route::post('/orders/create', [OrdersController::class, 'createOrder']);//ADDED THISSSSSS  

Route::get('/test-db', function () {
    try {
        $result = DB::table('equipment')->limit(5)->get();
        return response()->json($result);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
