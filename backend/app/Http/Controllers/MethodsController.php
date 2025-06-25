<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Methods;
use App\Models\Analytes;
use App\Models\TurnAroundTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class MethodsController extends Controller
{
    /**
     * Display a listing of the methods.
     */
    public function searchMethodByAnalyteId($analyte_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        if(!is_numeric($analyte_id) || $analyte_id < 1){
            return response()->json(['message'=>'Please enter a valid analyte id'],400);
        }
        
        $analyte = Analytes::find($analyte_id);
        if (!$analyte) {
            return response()->json(['error' => 'Analyte not found'], 404);
        }

        return $analyte->getMethodsByAnalyteId($analyte_id);
    }

    /**
     * Store a newly created method in storage.
     */
    public function createMethod(Request $request, $analyte_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        if(!is_numeric($analyte_id) || $analyte_id < 1){
            return response()->json(['message'=>'Please enter a valid analyte id'],400);
        }
        
        $validator = Validator::make($request->all(), [
            'method_name' => 'required|string|max:100',
            'matrix' => 'nullable|string|max:100',
            'media' => 'nullable|string|max:100',
            'measurement' => 'nullable|string|max:100',
            'sample_rate' => 'nullable|string|max:100',
            'limit_of_quantification' => 'nullable|string|max:100',
            'general_comments' => 'nullable|string|max:255',
        ]);
        $method = new Methods();
        $method->analyte_id=$analyte_id;
        $method->method_name = $request->input('method_name');
        $method->matrix = $request->input('matrix');
        $method->media = $request->input('media');
        $method->measurement = $request->input('measurement');
        $method->sample_rate = $request->input('sample_rate');
        $method->limit_of_quantification = $request->input('limit_of_quantification');
        $method->general_comments = $request->input('general_comments');
        $method->is_active = $request->input('is_active', 1); // Default value of true
        
        $method->save();

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        return response()->json($method, 201);
    }

    /**
     * Display the specified method.
     */
    public function showMethodByMethodId($method_id)
    {
        if(!is_numeric($method_id) || $method_id < 1){
            return response()->json(['message'=>'Please enter a valid method id'],400);
        }
        
        $method = Methods::find($method_id);

        if (!$method) {
            return response()->json(['message' => 'Method not found'], 404);
        }

        return response()->json($method);
    }

    public function updateMethod(Request $request, $method_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        if(!is_numeric($method_id) || $method_id < 1){
            return response()->json(['message'=>'Please enter a valid method id'],400);
        }
        
        $validator = Validator::make($request->all(), [
            'method_name_param' => 'required|string|max:100',
            'matrix_param' => 'nullable|string|max:100',
            'media_param' => 'nullable|string|max:100',
            'measurement_param' => 'nullable|string|max:100',
            'sample_rate_param' => 'nullable|string|max:100',
            'limit_of_quantification_param' => 'nullable|string|max:100',
            'general_comments_param' => 'nullable|string|max:255',
            'is_active_param' => 'required|integer|in:0,1',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Update method information
        DB::table('methods')
            ->where('method_id', $method_id)
            ->update([
                'method_name' => $request->input('method_name_param'),
                'matrix' => $request->input('matrix_param'),
                'media' => $request->input('media_param'),
                'measurement' => $request->input('measurement_param'),
                'sample_rate' => $request->input('sample_rate_param'),
                'limit_of_quantification' => $request->input('limit_of_quantification_param'),
                'general_comments' => $request->input('general_comments_param'),
                'is_active' => $request->input('is_active_param'),
            ]);

        // Update turn_around_times if is_active_param is 0 or 1
        if ($request->input('is_active_param') === 0 || $request->input('is_active_param') === 1) {
            DB::table('turn_around_times')
                ->where('method_id', $method_id)
                ->update(['is_active' => $request->input('is_active_param')]);
        }
 
        return response()->json('Method updated successfully', 200);
    }

    public function getMethodsByAnalyteId($analyte_id) {
        $methods = DB::table('methods')
            ->select('methods.method_id', 'methods.method_name','methods.matrix', 'methods.media', 'methods.measurement', 'methods.sample_rate', 'methods.limit_of_quantification', 'methods.general_comments', 'methods.is_active','analytes.analyte_name as analyte_name', 'analytes.cas_number')
            ->join('analytes', 'methods.analyte_id', '=', 'analytes.analyte_id')
            ->where('methods.analyte_id', $analyte_id)
            ->where('methods.is_active', 1)
            ->get();
    
        foreach ($methods as $method) {
            $method->turn_around_times = DB::table('turn_around_times')
                ->select('turnaround_time', 'price', 'is_default_price')
                ->where('method_id', $method->method_id)
                ->where('turn_around_times.is_active', 1)
                ->get();
        }
    
        return response()->json($methods); // Convert array to JSON and return as response
    }

    public function getMethodByMethodId($method_id)
     {
        if(!is_numeric($method_id) || $method_id < 1){
            return response()->json(['message'=>'Please enter a valid method id'],400);
        }
        $methods = DB::table('methods')
            ->select(
                'methods.method_id',
                'methods.method_name',
                'methods.matrix',
                'methods.media',
                'methods.measurement',
                'methods.sample_rate',
                'methods.limit_of_quantification',
                'methods.general_comments',
                'analytes.analyte_name as analyte_name' // Alias the analyte_name column
            )
            ->join('analytes', 'methods.analyte_id', '=', 'analytes.analyte_id')
            ->where('methods.method_id', $method_id)
            ->where('methods.is_active', 1)
            ->get();
    
        foreach ($methods as $method) {
            $method->turn_around_times = DB::table('turn_around_times')
                ->select('turnaround_time', 'price', 'is_default_price', 'turn_around_id')
                ->where('method_id', $method->method_id)
                ->where('turn_around_times.is_active', 1)
                ->get();
        }
        return response()->json($methods);
    }

    public function getMethodsByAnalyteIdPricing(Request $request, $analyte_id) {
        $user = $request->user();
        $company_id = $user->company_id;
        
        // Retrieve methods
        $methods = DB::table('methods')
            ->join('analytes as a', 'methods.analyte_id', '=', 'a.analyte_id')
            ->select('methods.method_id', 'methods.method_name', 'methods.matrix', 'methods.media', 'methods.measurement', 'methods.sample_rate', 'methods.limit_of_quantification', 'methods.general_comments', 'methods.is_active', 'a.analyte_name', 'a.cas_number')
            ->where('methods.analyte_id', $analyte_id)
            ->where('methods.is_active', 1)
            ->get();
        
        // Retrieve all turn-around times related to the method ID
        $turnAroundTimes = DB::table('turn_around_times as t')
            ->select('t.turn_around_id', 't.price', 't.turnaround_time', 't.is_default_price', 'methods.method_id')
            ->join('methods', 't.method_id', '=', 'methods.method_id')
            ->where('methods.analyte_id', $analyte_id)
            ->where('t.is_active', 1)
            ->get();
        
        // Retrieve price overrides for the company
        $priceOverrides = DB::table('price_overrides')
            ->where('company_id', $company_id)
            ->whereIn('turn_around_id', $turnAroundTimes->pluck('turn_around_id'))
            ->get();
        
        // Organize turn-around times by method
        $methodsData = [];
        foreach ($methods as $method) {
            $methodsData[$method->method_id] = [
                'method_id' => $method->method_id,
                'method_name' => $method->method_name,
                'matrix' => $method->matrix,
                'media' => $method->media,
                'measurement' => $method->measurement,
                'sample_rate' => $method->sample_rate,
                'limit_of_quantification' => $method->limit_of_quantification,
                'general_comments' => $method->general_comments,
                'is_active' => $method->is_active,
                'analyte_name' => $method->analyte_name,
                'cas_number' => $method->cas_number,
                'turn_around_times' => []
            ];
        }
        
        // Merge turn-around times with price overrides and add to methods data
        foreach ($turnAroundTimes as $turnAroundTime) {
            $override = $priceOverrides->where('turn_around_id', $turnAroundTime->turn_around_id)->first();
            $price = $override ? $override->price_override : $turnAroundTime->price;
            
            $methodsData[$turnAroundTime->method_id]['turn_around_times'][] = [
                'turn_around_id' => $turnAroundTime->turn_around_id,
                'price' => $price,
                'turnaround_time' => $turnAroundTime->turnaround_time,
                'is_default_price' => $turnAroundTime->is_default_price,
            ];
        }
        
        // Return methods data
        return response()->json(array_values($methodsData));
    }

    public function getMethodByMethodIdPricing(Request $request, $method_id) {

        $user = $request->user();
        $company_id = $user->company_id;

        $methods = DB::table('methods')
            ->select(
                'methods.method_id',
                'methods.method_name',
                'methods.matrix',
                'methods.media',
                'methods.measurement',
                'methods.sample_rate',
                'methods.limit_of_quantification',
                'methods.general_comments',
                'analytes.analyte_name as analyte_name' // Alias the analyte_name column
            )
            ->join('analytes', 'methods.analyte_id', '=', 'analytes.analyte_id')
            ->where('methods.method_id', $method_id)
            ->where('methods.is_active', 1)
            ->get();

        foreach ($methods as $method) {
            // Retrieve turn-around times for the method
            $turnAroundTimes = DB::table('turn_around_times')
                ->select('turn_around_id', 'turnaround_time', 'price', 'is_default_price')
                ->where('method_id', $method->method_id)
                ->where('turn_around_times.is_active', 1)
                ->get();

            // Retrieve price overrides for the company
            $priceOverrides = DB::table('price_overrides')
                ->where('company_id', $company_id) // Make sure $company_id is defined
                ->whereIn('turn_around_id', $turnAroundTimes->pluck('turn_around_id'))
                ->get();

            // Merge turn-around times with price overrides
            $method->turn_around_times = $turnAroundTimes->map(function ($turnAroundTime) use ($priceOverrides) {
                $override = $priceOverrides->where('turn_around_id', $turnAroundTime->turn_around_id)->first();
                $price = $override ? $override->price_override : $turnAroundTime->price;

                return [
                    'turnaround_time' => $turnAroundTime->turnaround_time,
                    'price' => $price,
                    'is_default_price' => $turnAroundTime->is_default_price,
                    'turn_around_id' => $turnAroundTime->turn_around_id
                ];
            });
        }
        return response()->json($methods);
    }
}
