<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TurnAroundTime;
use App\Models\Methods;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class TurnAroundTimeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $turnaroundTimes = TurnAroundTime::all();
        return response()->json($turnaroundTimes);
    }
     
    public function show($turnaround_id)
    {
        if(!is_numeric($turnaround_id) || $turnaround_id < 1){

            return response()->json(['message' => 'Please enter a valid'], 400);
        }
        $turnaroundTime = TurnAroundTime::find($turnaround_id);

        if (!$turnaroundTime) {
            return response()->json(['message' => 'Turnaround time not found'], 404);
        }

        return response()->json(['message'=>$turnaroundTime],200);

    }

    public function setAllTurnAroundTimes(Request $request, $method_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        //Check to see method_id is null or less then one if so response message bad request
        //  add the validator code  for $request
        $turnAroundTimeList = $request->all();

        $is14DaysPassed = false;
        $is7DaysPassed = false;
    
        foreach ($turnAroundTimeList as $turnaround) {
            if ($turnaround['turnaround_time'] === '14 Days') {
                $is14DaysPassed = true;
            } elseif ($turnaround['turnaround_time'] === '7 Days') {
                $is7DaysPassed = true;
            }

            TurnAroundTime::updateOrCreate(
                ['method_id' => $method_id, 'turnaround_time' => $turnaround['turnaround_time']],
                [
                    'price' => $turnaround['price'],
                    'is_active' => $turnaround['is_active'],
                    'is_default_price' => $turnaround['is_default_price']
                ]
            );
        }
    
        if ($is14DaysPassed) {
            TurnAroundTime::where('method_id', $method_id)
                ->where('turnaround_time', '7 Days')
                ->update(['is_active' => 0, 'is_default_price' => 0]);
        }
    
        if ($is7DaysPassed) {
            TurnAroundTime::where('method_id', $method_id)
                ->where('turnaround_time', '14 Days')
                ->update(['is_active' => 0, 'is_default_price' => 0]);
        }
    
        return response()->json(['message' => 'Turn around times updated or inserted successfully'], 200);
    }

    public function getTurnAroundTimesByMethodId($method_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        if(!is_numeric($method_id) || $method_id < 1){
            return response()->json(['message'=>'Please enter a valid method id.']);
        }
        $turnAroundTime = Methods::find($method_id);
        if (!$turnAroundTime) {
            return response()->json(['error' => 'Turn around time not found'], 404);
        }

        return $turnAroundTime->getTurnAroundTimeByMethodId($method_id);
    }

    public function getTurnAroundTimes($methodId)
    {
        if(!is_numeric($methodId) || $methodId  < 1){
            return response()->json(['message'=>'Please enter a valid method id.']);
        }
        // Retrieve all turn around times related to the method_id where is_active = 1
        $turnAroundTimes = TurnAroundTime::where('method_id', $methodId)
                                        ->where('is_active', 1)
                                        ->get();
        
        // Check if any turn around times were found
        if ($turnAroundTimes->isEmpty()) {
            return response()->json(['message' => 'No active turn around times found for the given method_id'], 404);
        }
        
        // Return the turn around times
        return response()->json($turnAroundTimes);
    }
}
