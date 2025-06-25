<?php

namespace App\Http\Controllers;

use App\Models\PriceOverrides;
// use App\Models\Companies;
// use App\Models\TurnAroundTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PriceOverRideController extends Controller
{
    //
    public function CreatePriceOverRide(Request $request)
    {
        $validator= Validator::make($request->all(),[
            'company_id'=>'required',
            'turn_around_id'=>'required',
            'price_override'=>'required|numeric',
        ]);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()], 400);
        }
        $priceOverride = new PriceOverrides();
        $priceOverride->company_id=$request->input('company_id');
        $priceOverride->turn_around_id=$request->input('turn_around_id');
        $priceOverride->price_override= $request->input('price_override');
        $priceOverride->save();

        $params =[$request->input('company_id'),$request->input('turn_around_id'),$request->input('price_override')];

        return response()->json($params, 200);

    }

    public function UpdatePriceOverRide(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_id' => 'required', 
            'turn_around_id' => 'required',
            'price_override' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $company_id = $request->input('company_id');

        // Check if PriceOverrides record exists
        $priceOverride = DB::table('price_overrides')
            ->where('company_id', $company_id)
            ->first();

        if (!$priceOverride) {
            return response()->json(['error' => 'PriceOverride not found'], 404);
        }

        // Update the PriceOverrides record
        DB::table('price_overrides')
            ->where('company_id', $company_id)
            ->update([
                'turn_around_id' => $request->input('turn_around_id'),
                'price_override' => $request->input('price_override'),
            ]);

        $params = [
            'company_id' => $company_id,
            'turn_around_id' => $request->input('turn_around_id'),
            'price_override' => $request->input('price_override'),
        ];

        return response()->json($params, 200);
    }

    public function getPriceOverrideOrDefaultPrice($company_id, $method_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        // Retrieve all turn-around times related to the method ID
        $turnAroundTimes = DB::table('turn_around_times as t')
            ->select('t.turn_around_id', 't.price', 't.turnaround_time')
            ->where('t.method_id', $method_id)
            ->where('t.is_active', 1)
            ->get();
    
        // Retrieve price overrides for the company
        $priceOverrides = DB::table('price_overrides')
            ->where('company_id', $company_id)
            ->whereIn('turn_around_id', $turnAroundTimes->pluck('turn_around_id'))
            ->get();
    
        // Merge turn-around times with price overrides
        $result = [];
        foreach ($turnAroundTimes as $turnAroundTime) {
            $override = $priceOverrides->where('turn_around_id', $turnAroundTime->turn_around_id)->first();
            $price = $override ? $override->price_override : $turnAroundTime->price;
            $result[] = [
                'turn_around_id' => $turnAroundTime->turn_around_id,
                'price' => $price,
                'default_price' => $turnAroundTime->price,
                'turnaround_time' => $turnAroundTime->turnaround_time,
            ];
        }
    
        return response()->json($result);
    }

    public function resetCustomerPricing(Request $request, $companyId)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        $jsonData = $request->json()->all();

        foreach ($jsonData as $item) {
            $turnaroundId = $item['turn_around_id'];
            $newPrice = $item['price'];

            // Check if the turn_around_id exists in the turn_around_times table
            $existingPrice = DB::table('turn_around_times')
                ->where('turn_around_id', $turnaroundId)
                ->value('price');

            if ($existingPrice !== null && $existingPrice != $newPrice) {
                // Check if an override already exists for the given turn_around_id and company_id
                $existingOverride = DB::table('price_overrides')
                    ->where('turn_around_id', $turnaroundId)
                    ->where('company_id', $companyId)
                    ->exists();

                if ($existingOverride) {
                    // Update the existing override with the new price
                    DB::table('price_overrides')
                        ->where('turn_around_id', $turnaroundId)
                        ->where('company_id', $companyId)
                        ->update(['price_override' => $newPrice]);
                } else {
                    // Insert a new row into the price_overrides table with the updated price
                    DB::table('price_overrides')->insert([
                        'turn_around_id' => $turnaroundId,
                        'company_id' => $companyId,
                        'price_override' => $newPrice
                    ]);
                }
            } elseif ($existingPrice !== null && $existingPrice == $newPrice) {
                // If the override price matches the price in turn_around_times table, delete the override
                DB::table('price_overrides')
                    ->where('turn_around_id', $turnaroundId)
                    ->where('company_id', $companyId)
                    ->delete();
            }
        }

        return response()->json(['message' => 'Customer pricing reset successfully']);
    }
}

