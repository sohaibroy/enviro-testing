<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\EquipmentAttributes;
class EquipmentAttributesController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $equipmentAttributes = EquipmentAttributes::all();

        return response()->json($equipmentAttributes);
    }

    public function getAttributeByID($attribute_id)
    {
//        $user = Auth::user();
//
//        if (strpos($user, 'admin') === false) {
//            return response()->json(['message' => 'You are not authorized to view this page'], 401);
//        }

        if (!is_numeric($attribute_id) || $attribute_id < 1) {
            return response()->json(['message' => 'Invalid attribute ID'], 400);
        }

        $equipmentAttribute = EquipmentAttributes::where('attribute_id', $attribute_id)->first();

        if ($equipmentAttribute) {
            return response()->json($equipmentAttribute);
        } else {
            return response()->json(['message' => 'Attribute not found'], 404);
        }
    }

    public function getAttributeByEquipmentTypeID($equipment_type_id)
    {
//        $user = Auth::user();
//
//        if (strpos($user, 'admin') === false) {
//            return response()->json(['message' => 'You are not authorized to view this page'], 401);
//        }

        if (!is_numeric($equipment_type_id) || $equipment_type_id < 1) {
            return response()->json(['message' => 'Invalid equipment type ID'], 400);
        }

        $equipmentAttributes = EquipmentAttributes::where('equipment_type_id', $equipment_type_id)->get();

        if ($equipmentAttributes) {
            return response()->json($equipmentAttributes);
        } else {
            return response()->json(['message' => 'Attributes not found'], 404);
        }
    }

    public function getExactAttribute($equipment_type_id, $attribute_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        if (!is_numeric($equipment_type_id) || $equipment_type_id < 1) {
            return response()->json(['message' => 'Invalid equipment type ID'], 400);
        }

        if (!is_numeric($attribute_id) || $attribute_id < 1) {
            return response()->json(['message' => 'Invalid attribute ID'], 400);
        }

        $equipmentAttribute = EquipmentAttributes::where([
            ['equipment_type_id', $equipment_type_id],
            ['attribute_id', $attribute_id]
        ])->first();

        if ($equipmentAttribute) {
            return response()->json($equipmentAttribute);
        } else {
            return response()->json(['message' => 'Attribute not found'], 404);
        }
    }

    public function createAttribute(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'attributes' => 'required|array',
            'attributes.*.equipment_type_id' => 'required|integer',
            'attributes.*.attribute_name' => 'required|string|max:100',
            'attributes.*.attribute_data_type' => 'nullable|string|max:30'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        foreach($request->input('attributes') as $attributeDate) {
            $equipmentAttribute = new EquipmentAttributes();
            $equipmentAttribute->equipment_type_id = $attributeDate['equipment_type_id'];
            $equipmentAttribute->attribute_name = $attributeDate['attribute_name'];
            $equipmentAttribute->attribute_data_type = $attributeDate['attribute_data_type'];

            if (!$equipmentAttribute->save()) {
                return response()->json(['message' => 'Create attribute failed'], 400);
            }
        }
        return response()->json(['message' => 'Attributes created successfully'], 200);
    }

    public function updateAttribute(Request $request)
    {
        $user = Auth::user();

        if(strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $validator = Validator::make($request->all(), [
            'attributes' => 'required|array',
            'attributes.*.attribute_id' => 'required|integer',
            'attributes.*.equipment_type_id' => 'required|integer',
            'attributes.*.attribute_name' => 'required|string|max:100',
            'attributes.*.attribute_data_type' => 'nullable|string|max:30'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        foreach($request->input('attributes') as $attributeDate) {
            DB::table('equipment_attributes')
                ->where('attribute_id', $attributeDate['attribute_id'])
                ->where('equipment_type_id', $attributeDate['equipment_type_id'])
                ->update([
                    'attribute_name' => $attributeDate['attribute_name'],
                    'attribute_data_type' => $attributeDate['attribute_data_type']
                ]);
        }

        return response()->json(['message' => 'Attributes updated successfully'], 200);
    }
    public function createOrUpdateAttributes(Request $request)
{
    $user = Auth::user();

    if(strpos($user, 'admin') === false) {
        return response()->json(['message' => 'You are not authorized to view this page'], 401);
    }

    $validator = Validator::make($request->all(), [
        'attributes' => 'required|array',
        'attributes.*.equipment_type_id' => 'required|integer',
        'attributes.*.attribute_name' => 'required|string|max:100',
        'attributes.*.attribute_data_type' => 'nullable|string|max:30'
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 400);
    }

    foreach ($request->input('attributes') as $attr) {
        DB::table('equipment_attributes')->updateOrInsert(
            [
                'equipment_type_id' => $attr['equipment_type_id'],
                'attribute_name' => $attr['attribute_name'], // match on these
            ],
            [
                'attribute_data_type' => $attr['attribute_data_type'] ?? null,
            ]
        );
    }

     return response()->json(['message' => 'Attributes created/updated successfully'], 200);
}
}