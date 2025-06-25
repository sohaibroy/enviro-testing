<?php

namespace App\Http\Controllers;

use App\Models\RentalDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

/**
 *
 */
class RentalDetailsController extends Controller
{

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $rentalDetails = RentalDetails::all();
        return response()->json($rentalDetails);
    }

    // Not needed anymore. Rental Details are created with the rental in RentalController.
    // /**
    //  * Create a rental detail
    //  * @param Request $request
    //  * @param $rental_id
    //  * @return \Illuminate\Http\JsonResponse
    //  */
    // public function createRentalDetails(Request $request, $rental_id)
    // {
    //     $validator= Validator::make($request->all(),[
    //         'rental_details' => 'required|array',
    //         'rental_details.*.equipment_id' => 'required|integer',
    //         'rental_details.*.start_date' => 'required|date',
    //         'rental_details.*.end_date' => 'required|date',
    //         'rental_details.*.return_date' => 'nullable|date',
    //         'rental_details.*.quantity' => 'required|integer',
    //         'rental_details.*.price' => 'required|numeric',
    //         'rental_details.*.equipment_condition' => 'nullable|string'
    //     ]);

    //     if($validator->fails()){
    //         return response()->json(['errors' => $validator->errors()], 400);
    //     }

    //     foreach ($request->rental_details as $detail) {
    //         $rentalDetail = new RentalDetails();
    //         $rentalDetail->rental_id = $rental_id;
    //         $rentalDetail->equipment_id = $detail['equipment_id'];
    //         $rentalDetail->start_date = $detail['start_date'];
    //         $rentalDetail->end_date = $detail['end_date'];
    //         $rentalDetail->return_date = $detail['return_date'];
    //         $rentalDetail->quantity = $detail['quantity'];
    //         $rentalDetail->price = $detail['price'];
    //         $rentalDetail->condition = $detail['equipment_condition'];
    //         $rentalDetail->is_active = 1;

    //         if (!$rentalDetail->save()) {
    //             return response()->json(['message' => 'Failed to create rental detail'], 500);
    //         }
    //     }

    //     return response()->json(['message' => 'Created new rental detail(s)'], 200);
    // }

    /**
     * Get rental details with equipment by rental id
     * @param $rental_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRentalDetailsByRentalID($rental_id)
    {
        if (!is_numeric($rental_id) || $rental_id < 1) {
            return response()->json(['message' => 'Please enter a valid rental id'], 400);
        }

        $viewRentalDetails = DB::table('rental_details as r')
           ->select('r.rental_id', 'r.equipment_id', 'r.start_date', 'r.end_date', 'r.return_date', 'r.quantity', 'r.price', 'r.condition', 'r.is_active',
                    'e.equipment_name', 'e.equipment_type', 'e.daily_cost', 'e.model_number', 'e.available_quantity')
            ->leftJoin('equipment as e', 'r.equipment_id', '=', 'e.equipment_id')
            ->where('r.rental_id', $rental_id)
            ->get();

        if ($viewRentalDetails->isEmpty()) {
            return response()->json(['message' => 'No rental details found for this rental id'], 404);
        }

        return response()->json($viewRentalDetails);
    }


    /**
     * Get rental details with equipment by serial id
     * @param $equipment_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRentalDetailsBySerialId($serial_id)
    {
        if (!is_numeric($serial_id) || $serial_id < 1) {
            return response()->json(['message' => 'Please enter a valid equipment id'], 400);
        }

        $viewRentalDetails = DB::table('rental_details as rd')
           ->select('rd.rental_id', 'rd.serial_id', 'rd.start_date', 'rd.end_date', 'rd.return_date', 'rd.quantity', 'rd.price', 'rd.equipment_condition', 'rd.is_active',
                    'ed.serial_number', 'ed.status', 'ed.equipment_id', 'e.equipment_name', 'e.description', 'e.daily_cost', 'e.available_quantity')
            ->leftJoin('equipment_details as ed', 'rd.serial_id', '=', 'ed.serial_id')
            ->leftJoin('equipment as e', 'ed.equipment_id', '=', 'e.equipment_id')
            ->where('r.serial_id', $serial_id)
            ->get();

        if ($viewRentalDetails->isEmpty()) {
            return response()->json(['message' => 'No rental details found for this equipment id'], 404);
        }

        return response()->json($viewRentalDetails);
    }

    /**
     * @param Request $request
     * @param $rental_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateRentalDetails(Request $request, $rental_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        if (!is_numeric($rental_id) || $rental_id < 1) {
            return response()->json(['message' => 'Please enter a valid rental id'], 400);
        }

        $validator = Validator::make($request->all(), [
            'rental_details' => 'required|array',
            'rental_details.*.serial_id' => 'required|integer',
            'rental_details.*.return_date' => 'required|date',
            'rental_details.*.equipment_condition' => 'required|string|max:255',
            'rental_details.*.is_active' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $rentalDetails = RentalDetails::where('rental_id', $rental_id)->get();

        if ($rentalDetails->isEmpty()) {
            return response()->json(['message' => 'No rental details found for this rental id'], 404);
        }

        foreach ($request->rental_details as $detail) {
            DB::table('rental_details')
                ->where([[ 'rental_id', $rental_id ], [ 'serial_id', $detail['serial_id'] ]])
                ->update([
                    'return_date' => $detail['return_date'],
                    'equipment_condition' => $detail['equipment_condition'],
                    'is_active' => $detail['is_active']
                ]);
        }

        return response()->json(['message' => 'Rental details updated successfully'], 200);
    }
}
