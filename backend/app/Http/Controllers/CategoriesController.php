<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categories;
use App\Models\Synonyms;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the categories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        $categories = Categories::all();
        return response()->json($categories);
    }

    /**
     * Store a newly created Categories in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCategory(Request $request, $analyte_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        if(!is_numeric($analyte_id) || $analyte_id < 1){
            return response()->json(['message'=>'Please enter a valid analyte id'],400);
        }

        $validator = Validator::make($request->all(), [
            'category_name' => 'required|string|max:100',
            'technique' => 'nullable|string|max:100',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        if($analyte_id <= 0 || $analyte_id === null){
            return response()->json(['message'=>'Please enter a valid Analyte Id'],400);
        }

        $category = new Categories();
        $category->analyte_id = $analyte_id;
        $category->category_name = $request->input('category_name');
        $category->technique = $request->input('technique');
        $category->is_active = $request->input('is_active', 1); // Default value of true
        $category->save();
    
        $params = [
            $category->analyte_id,
            $category->category_name,
            $category->technique,
            $category->is_active
        ];

        return response()->json(['message'=>$params], 201);

    }
    /**
     * Display the specified category.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        
        $category = Categories::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json($category);
    }
    
    // all categories sortby analyte_id
    public function getCategoriesByAnalyteID($analyte_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        // Check if $analyte_id is not provided
        if(!is_numeric($analyte_id) || $analyte_id < 1){
            return response()->json(['message'=>'Please enter a valid analyte id'],400);
        }
    
        // Perform the search query
        $search = DB::table('categories')
                    ->select('category_id', 'category_name', 'technique', 'is_active')
                    ->where('analyte_id', $analyte_id)
                    ->get();
    
        // Return the search results
        return response()->json($search);
    }
    
    public function updateCategory(Request $request, $category_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        if(!is_numeric($category_id) || $category_id < 1){
            return response()->json(['message'=>'Please enter a valid category id'],400);
        }

        $validator = Validator::make($request->all(), [
            'category_name' => 'required|string|max:100',
            'technique' => 'nullable|string|max:100',
            'is_active' => 'required|integer|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        if($category_id <=0 || $category_id === null){
            return response()->json(['message'=>'Please enter a valid category id'],400);

        }
        // Extract parameters from the request
        $category_name = $request->input('category_name');
        $technique = $request->input('technique');
        $is_active = $request->input('is_active');


        // Update category information
        DB::table('categories')
            ->where('category_id', $category_id)
            ->update([
                'category_name' => $category_name,
                'technique' => $technique,
                'is_active' => $is_active,
            ]);

        $params =[$category_name,$technique,$is_active];
        
        return response()->json(['message'=>$params], 201);
    }
}
