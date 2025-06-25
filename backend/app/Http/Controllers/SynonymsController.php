<?php

namespace App\Http\Controllers;

use App\Models\Synonyms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class SynonymsController extends Controller
{
    public function createSynonym(Request $request, $category_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 


        if(!is_numeric($category_id) || $category_id < 1){
            return response()->json(['message' => 'Please enter a valid category id'], 404);
        }

         $validator = Validator::make($request->all(), [
            'synonym'=>'required'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        if($category_id <= 0 || $category_id === null)
        {
            return response()->json(['message'=>'Please enter a valid Category Id'],400);
        }
         $newCat = new Synonyms();
         $newCat->category_id =$category_id;
         $newCat->synonym = $request->input('synonym');
         $newCat->save();

         if(!$newCat){
            return response()->json(['message'=>'Creating new Category has Failed, Please try again'],400);
         }
         return response()->json($newCat);
    }

    public function deleteSynonyms($synonym_id)
    {   
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 

        if (!is_numeric($synonym_id) || $synonym_id < 1 ) {
        return response()->json(['message' => 'Synonym ID must be a number'], 400);
        }
        
       $deleteSynonym = Synonyms::where('synonym_id', $synonym_id)->delete();

       if(!$deleteSynonym === 0 || !$deleteSynonym === null)
       {
        return response()->json(['message'=>'Something went wrong, Please try again'],400);
       }
       return response()->json(['message'=>'You have successfully deleted a synonym'],200);
    }

    public function index($category_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        } 


        if (!is_numeric($category_id)) {
            return response()->json(['message' => 'Category ID must be a number'], 400);
        }
        // Retrieve all synonyms for the given category_id
        $synonyms = Synonyms::where('category_id', $category_id)->get();

        // Return the synonyms as JSON response
        return response()->json($synonyms, 200);
    }
}
