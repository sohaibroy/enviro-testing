<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\EquipmentValues;

class EquipmentValuesController extends Controller
{
    //
    public function getValueByEquipmentID($equipment_id)
    {
        $user = Auth::user();

        if(strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $equipmentValues = EquipmentValues::where('equipment_id', $equipment_id)->get();

        if ($equipmentValues) {
            return $equipmentValues;
        } else {
            return false;
        }
    }

    // Probably not needed
   public function getValueByAttributeID($attribute_id)
   {
       $user = Auth::user();

       if(strpos($user, 'admin') === false) {
           return response()->json(['message' => 'You are not authorized to view this page'], 401);
       }

       $equipmentValues = EquipmentValues::where('attribute_id', $attribute_id)->get();

       if ($equipmentValues) {
           return $equipmentValues;
       } else {
           return false;
       }
   }

    public function getExactEquipmentValue($equipment_id, $attribute_id)
    {
//        $user = Auth::user();
//
//        if(strpos($user, 'admin') === false) {
//            return response()->json(['message' => 'You are not authorized to view this page'], 401);
//        }

        if (!is_numeric($equipment_id) || $equipment_id < 1) {
            return response()->json(['message' => 'Invalid equipment ID'], 400);
        }

        if (!is_numeric($attribute_id) || $attribute_id < 1) {
            return response()->json(['message' => 'Invalid attribute ID'], 400);
        }

        $equipmentValue = EquipmentValues::where([
            [ 'equipment_id', $equipment_id ],
            [ 'attribute_id', $attribute_id ]])
            ->first();

        if ($equipmentValue) {
            return $equipmentValue;
        } else {
            return false;
        }
    }

    public function createEquipmentValue(Request $request)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $validator = Validator::make($request->all(), [
            'values' => 'required|array',
            'values.*.equipment_id' => 'required|integer',
            'values.*.attribute_id' => 'required|integer',
            'values.*.attribute_value' => 'nullable|string|max:100',
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        foreach ($request->values as $value) {
            $equipmentValue = new EquipmentValues();
            $equipmentValue->equipment_id = $value['equipment_id'];
            $equipmentValue->attribute_id = $value['attribute_id'];
            $equipmentValue->attribute_value = $value['attribute_value'];

            if (!$equipmentValue->save()) {
                return response()->json(['message' => 'Create equipment value failed'], 400);
            }
        }

        return response()->json(['message' => 'Value(s) created successfully'], 200);
    }

    public function updateEquipmentValue(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'values' => 'required|array',
            'values.*.equipment_id' => 'required|integer',
            'values.*.attribute_id' => 'required|integer',
            'values.*.attribute_value' => 'nullable|string|max:100',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        foreach ($request->values as $value) {
            DB::table('equipment_values')->updateOrInsert(
                [
                    'equipment_id' => $value['equipment_id'],
                    'attribute_id' => $value['attribute_id'],
                ],
                [
                    'attribute_value' => $value['attribute_value'],
                ]
            );
        }
    
        return response()->json(['message' => 'Value(s) updated successfully'], 200);
    }
    
}
