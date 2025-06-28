<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Equipment;
use App\Models\EquipmentTypes;
use App\Models\EquipmentAttributes;
use App\Models\EquipmentValues;
use Laravel\Sanctum\PersonalAccessToken;

class EquipmentController extends Controller
{
    // Show all records from the equipment table
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || strpos($user->role ?? '', 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $equipment = Equipment::all();
        return response()->json($equipment);
    }

    public function getActiveEquipment()
    {
        $equipment = Equipment::where('is_active', 1)->get();
        return response()->json($equipment);
    }

    public function createEquipment(Request $request)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $validator = Validator::make($request->all(), [
            'equipment_name' => 'required|string|max:100',
            'specsheet' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'daily_cost' => 'required|numeric',
            'available_quantity' => 'required|integer',
            'is_active' => 'required|integer|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        DB::beginTransaction();
        try{
        $equipment = new Equipment();
        $equipment->equipment_name = $request->input('equipment_name');
        $equipment->specsheet = $request->input('specsheet');
        $equipment->description = $request->input('description');
        $equipment->daily_cost = $request->input('daily_cost');
        $equipment->available_quantity = $request->input('available_quantity');
        $equipment->is_active = $request->input('is_active', 1);
        $equipment->save();
        DB::table('equipment_details')->insert([
            'equipment_id' => $equipment->equipment_id,
            'serial_number' => 'SRL-' . strtoupper(Str::random(6)),
            'status' => 'available',
        ]);

        DB::commit();
        return response()->json(['message' => $equipment], 200);
    } catch (\Throwable $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Create equipment failed',
            'error' => $e->getMessage()
        ], 500);
    }
        
      
    }



    public function show($equipment_id)
    {
        if (!is_numeric($equipment_id) || $equipment_id < 1) {
            return response()->json(['message' => 'Please enter a valid equipment ID'], 400);
        }

        $equipment = Equipment::find($equipment_id);

        if (!$equipment) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        return response()->json($equipment, 200);
    }

    public function updateEquipment(Request $request, $equipment_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        if (!is_numeric($equipment_id) || $equipment_id < 1) {
            return response()->json(['message' => 'Please enter a valid equipment ID'], 400);
        }

        $validator = Validator::make($request->all(), [
            'equipment_name' => 'required|string|max:100',
            'specsheet' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'daily_cost' => 'required|numeric',
            'available_quantity' => 'required|integer',
            'is_active' => 'required|integer|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        DB::table('equipment')
            ->where('equipment_id', $equipment_id)
            ->update([
                'equipment_name' => $request->input('equipment_name'),
                'specsheet' => $request->input('specsheet'),
                'description' => $request->input('description'),
                'daily_cost' => $request->input('daily_cost'),
                'available_quantity' => $request->input('available_quantity'),
                'is_active' => $request->input('is_active'),
            ]);

        return response()->json(['message' => 'Equipment updated successfully'], 200);
    }

    public function searchEquipment(Request $request)
    {
        $searchTerm = $request->query('search');
    
        if (empty($searchTerm)) {
            return $this->index($request);
        }
    
        $equipment = Equipment::where('equipment_name', 'like', '%' . $searchTerm . '%')
            ->orWhere('description', 'like', '%' . $searchTerm . '%')
            ->get();
    
        if ($equipment->isEmpty()) {
            return response()->json(['message' => 'No equipment found'], 404);
        }
    
        return response()->json($equipment, 200);
    }

    public function getEquipmentByEquipmentTypeID($equipmentTypeID)
    {
        if (!is_numeric($equipmentTypeID) || $equipmentTypeID < 1) {
            return response()->json(['message' => 'Please enter a valid equipment type ID'], 400);
        }

        $equipment_type = EquipmentTypes::find($equipmentTypeID);

        if (!$equipment_type) {
            return response()->json(['message' => 'Equipment type not found'], 404);
        }

        // Get everything from all equipment related tables
        $equipment = DB::table('equipment')
            ->join('equipment_values', 'equipment.equipment_id', '=', 'equipment_values.equipment_id')
            ->join('equipment_attributes', 'equipment_values.attribute_id', '=', 'equipment_attributes.attribute_id')
            ->join('equipment_types', 'equipment_attributes.equipment_type_id', '=', 'equipment_types.equipment_type_id')
            ->where('equipment_types.equipment_type_id', $equipmentTypeID)
            ->get();

        if ($equipment->isEmpty()) {
            return response()->json(['message' => 'No equipment found'], 404);
        } else {
            return response()->json($equipment, 200);
        }
    }


    public function getAllEquipment(Request $request)
    {
        \Log::info('EquipmentController@getAllEquipment reached');
        $accessToken = $request->bearerToken();
        $user = null;

        if ($accessToken) {
            $tokenModel = PersonalAccessToken::findToken($accessToken);
            if ($tokenModel) {
                $user = $tokenModel->tokenable;
            }
        }

        \Log::info('Token:', ['token' => $accessToken]);
        \Log::info('User:', ['user' => optional($user)->id]);

        \Log::info('User loading equipment:', ['user' => optional($user)->account_id]);

        //$companyId = $user ? $user->company_id : null;
        $companyId = $user && property_exists($user, 'company_id') ? $user->company_id : null; //ADDED THIS FOR DEBUG

        try {
            // $equipment = DB::table('equipment')
            //     ->leftjoin('equipment_values', 'equipment.equipment_id', '=', 'equipment_values.equipment_id')
            //     ->leftjoin('equipment_attributes', 'equipment_values.attribute_id', '=', 'equipment_attributes.attribute_id')
            //     ->leftjoin('equipment_types', 'equipment_attributes.equipment_type_id', '=', 'equipment_types.equipment_type_id')
            //     ->where('equipment.is_active', 1)
            //     ->select(
            //         'equipment.*',
            //         'equipment_types.equipment_type_id as type_id',
            //         'equipment_types.equipment_type_name',
            //         'equipment_attributes.attribute_id',
            //         'equipment_attributes.attribute_name',
            //         'equipment_values.attribute_value'
            //     )   //COMMENTED THIS FOR TESTING
       $equipment = DB::table('equipment')
    ->join('equipment_types', 'equipment.type_id', '=', 'equipment_types.type_id')
    ->leftJoin('equipment_values', 'equipment.equipment_id', '=', 'equipment_values.equipment_id')
    ->leftJoin('equipment_attributes', 'equipment_values.attribute_id', '=', 'equipment_attributes.attribute_id')
    ->select(
        'equipment.equipment_id',
        'equipment.equipment_name',
        'equipment.description',
        'equipment.image_path',
        'equipment.specsheet',
        'equipment.daily_cost',
        'equipment.available_quantity',
        'equipment.is_active',
        'equipment.type_id',
        'equipment_types.equipment_type_name',
        'equipment_attributes.attribute_id',
        'equipment_attributes.attribute_name',
        'equipment_values.attribute_value'
    )
    ->get()
    ->map(function ($item) {
        if ($item->image_path) {
            $item->image_url = url('storage/equipment-images/' . $item->image_path);
        } else {
            $item->image_url = null;
        }
        return $item;
    });

            if ($equipment->isEmpty()) {
                return response()->json(['message' => 'No active equipment found'], 404);
            }

            return response()->json($equipment, 200);

        } catch (\Throwable $e) {
            \Log::error('Failed to fetch equipment list', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to fetch equipment list'], 500);
        }
    }


    public function deleteEquipment($equipment_id)
    {
        $user = Auth::user();
    
        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to delete equipment'], 401);
        }
    
        if (!is_numeric($equipment_id) || $equipment_id < 1) {
            return response()->json(['message' => 'Invalid equipment ID'], 400);
        }
    
        try {
            // remove serials first
            DB::table('equipment_details')->where('equipment_id', $equipment_id)->delete();
    
            // delete equipment
            $deleted = Equipment::where('equipment_id', $equipment_id)->delete();
    
            if ($deleted) {
                return response()->json(['message' => 'Equipment deleted successfully'], 200);
            } else {
                return response()->json(['message' => 'Equipment not found'], 404);
            }
    
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete equipment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

}
