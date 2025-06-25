<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\EquipmentTypes;
class EquipmentTypesController extends Controller
{
    public function index()
    {
        $equipmentTypes = EquipmentTypes::all();

        return response()->json($equipmentTypes);
    }

    public function createEquipmentType(Request $request)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $validator = Validator::make($request->all(), [
            'equipment_type_name' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $equipmentType = new EquipmentTypes();
        $equipmentType->equipment_type_name = $request->input('equipment_type_name');

        if ($equipmentType->save()) {
            return response()->json(['message' => $equipmentType], 200);
        } else {
            return response()->json(['message' => 'Create equipment type failed'], 400);
        }
    }

    public function updateEquipmentType(Request $request, $equipmentTypeID)
    {
        $user = Auth::user();

        if(strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $validator = Validator::make($request->all(), [
            'equipment_type_name' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        DB::table('equipment_types')
            ->where('equipment_type_id', $equipmentTypeID)
            ->update([
                'equipment_type_name' => $request->input('equipment_type_name')
            ]);

        return response()->json(['message' => 'Equipment type updated successfully'], 200);
    }

    public function getEquipmentTypeByID($equipmentTypeID)
    {
//        $user = Auth::user();
//
//        if (strpos($user, 'admin') === false) {
//            return response()->json(['message' => 'You are not authorized to view this page'], 401);
//        }

        if (!is_numeric($equipmentTypeID) || $equipmentTypeID < 1) {
            return response()->json(['message' => 'Please enter a valid equipment type ID'], 400);
        }

        $equipmentType = EquipmentTypes::find($equipmentTypeID);

        if (!$equipmentType) {
            return response()->json(['message' => 'Equipment type not found'], 404);
        }

        return response()->json($equipmentType, 200);
    }
}
