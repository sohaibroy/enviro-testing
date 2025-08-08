<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Accounts;
use App\Models\Companies;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } else {

            $companies = Companies::all();
            return response()->json($companies);
        }
    }

    // Search for a specific analyte by company_id
    public function getCompanyByCompanyId($company_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 
        
        if(!is_numeric($company_id) || $company_id < 1){
            return response()->json(['message'=>'Please enter a valid company id'],400);
        }

        $company = Companies::where('company_id',$company_id)->first();

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        return response()->json($company);
    }

    public function createCompany(Request $request)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }
    
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'company_name' => 'required',
            'company_phone' => 'required',
            'address' => 'required'
        ]);

        // Check if the validation fails
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $name =$request->input('company_name');
        $phone=$request->input('company_phone');
        $address=$request->input('address');
        $active =$request->input('is_active',1);

        $company= new Companies();
        $company->company_name=$name;
        $company->company_phone=$phone;
        $company->address=$address;
        $company->is_active=$active;
        $company->save();

        $params=[$name,$phone,$address,$active];

        return response()->json(['message'=>$params], 201);
    }


    public function updateCompany(Request $request, $company_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);

        } else {
            if(!is_numeric($company_id) || $company_id < 1){
                return response()->json(['message'=>'Please enter a valid company id'],400);
            }
            
            $validator = Validator::make($request->all(), [
                'company_name' => 'required|string',
                'company_phone' => 'required|string',
                'address' => 'required|string',
                'is_active' => 'required|boolean',
            ]);
        
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }
    
            $company_name = $request->input('company_name');
            $company_phone = $request->input('company_phone');
            $address = $request->input('address');
            $is_active = $request->input('is_active');
            $params =[$company_name,$company_phone,$address,$is_active];
    
            // Update company information
            DB::beginTransaction();
            try {
                DB::table('companies')
                    ->where('company_id', $company_id)
                    ->update([
                        'company_name' => $company_name,
                        'company_phone' => $company_phone,
                        'address' => $address,
                        'is_active' => $is_active,
                    ]);
        
                // If the company is being deactivated
                if (!$is_active) {
                    DB::table('accounts')
                        ->where('company_id', $company_id)
                        ->update(['is_active' => $request->input('is_active')]);
                }
                DB::commit();
        
                return response()->json(['message' => $params], 200);
    
            } catch (\Exception $e) {
                DB::rollback();
                return response()->json(['error' => 'Failed to update company information'], 500);
            }
        }
    }


    public function searchCompanyByName($searchTerm)
    {
       
        $searchCompany = Companies::where('company_name', 'like', '%' . $searchTerm . '%')->get();
        
        if ($searchCompany->isEmpty()) {
            return response()->json(['message' => "No company found"], 404);
        } else {
            return response()->json(['message'=>$searchCompany], 200);
        }
    }

    public function deleteCompany($company_id) {
    $deleted = DB::table('companies')->where('company_id', $company_id)->delete();
    if (!$deleted) {
        return response()->json(['message' => 'Not found'], 404);
    }
    return response()->json(['message' => 'Deleted'], 200);
}
}
