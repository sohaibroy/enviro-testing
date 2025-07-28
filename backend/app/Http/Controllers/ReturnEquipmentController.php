<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReturnEquipmentController extends Controller
{
    public function returnEquipment(Request $request)
    {
        $orderId = $request->input('order_id');
        $equipmentName = $request->input('equipment_name');
        $quantity = $request->input('quantity');

        $equipmentId = DB::table('equipment')
            ->where('equipment_name', $equipmentName)
            ->value('equipment_id');

        if (!$equipmentId) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        // Get rented serials for this order and equipment
        $serialsToReturn = DB::table('equipment_details')
            ->join('order_equipment', 'equipment_details.serial_id', '=', 'order_equipment.serial_id')
            ->where('equipment_details.equipment_id', $equipmentId)
            ->where('order_equipment.order_id', $orderId)
            ->where('equipment_details.status', 'rented')
            ->limit($quantity)
            ->pluck('equipment_details.serial_id');

        if ($serialsToReturn->isEmpty()) {
            return response()->json(['message' => 'No rented units found for return'], 404);
        }

        // Update their status
        DB::table('equipment_details')
            ->whereIn('serial_id', $serialsToReturn)
            ->update(['status' => 'available']);

        return response()->json(['message' => 'Equipment returned successfully']);
    }
}
