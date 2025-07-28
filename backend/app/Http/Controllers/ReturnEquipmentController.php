<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReturnEquipmentController extends Controller
{
   public function returnEquipment(Request $request)
{
    try {
        $orderId = $request->input('order_id');
        $equipmentName = $request->input('equipment_name');
        $quantity = $request->input('quantity');

        $equipmentId = DB::table('equipment')
            ->where('equipment_name', $equipmentName)
            ->value('equipment_id');

        if (!$equipmentId) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        //just fetch rented serials for this equipment
        $serialsToReturn = DB::table('equipment_details')
            ->where('equipment_id', $equipmentId)
            ->where('status', 'rented')
            ->limit($quantity)
            ->pluck('serial_id');

        if ($serialsToReturn->isEmpty()) {
            return response()->json(['message' => 'No rented units found to return'], 404);
        }

        // Mark them as available
        DB::table('equipment_details')
            ->whereIn('serial_id', $serialsToReturn)
            ->update(['status' => 'available']);

        return response()->json(['message' => 'Equipment returned successfully']);
    } catch (\Exception $e) {
        \Log::error('Return error', ['error' => $e->getMessage()]);
        return response()->json(['message' => 'Server error'], 500);
    }
}
}
