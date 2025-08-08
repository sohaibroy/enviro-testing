<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Analytes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class AnalytesController extends Controller
{
    // Shows all records in the analytes table
    public function index()
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        $analytes = Analytes::all();
        return response()->json($analytes);
    }

    public function getActiveAnalytes()
    {
        $analytes = Analytes::where('is_active', 1)->get();
        return response()->json($analytes);
    }

    // Create operation: Method for creating a new analyte
    public function createAnalyte(Request $request): JsonResponse
{

     $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

    $validator = Validator::make($request->all(), [
        'analyte_name' => 'required|string|max:255',
        'cas_number'   => 'nullable|regex:/^[\d-]+$/',
        'is_active'    => 'nullable|integer|in:0,1',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 400);
    }

    $analyte = Analytes::create([
        'analyte_name' => $request->input('analyte_name'),
        'cas_number'   => $request->input('cas_number'),
        'is_active'    => (int) $request->input('is_active', 1),
    ]);

    return response()->json($analyte, 201);
}

    // Update an existing analyte
    public function updateAnalyte(Request $request, $analyte_id)
    {
        $user = Auth::user();

        if (strpos($user, 'admin') === false) {
            return response()->json(['message' => 'You are not authorized to view this page'], 401);
        }

        if(!is_numeric($analyte_id) || $analyte_id < 1){
            return response()->json(['message'=>'Please enter a valid analyte id'],400);
        }

        // Validate the incoming request data
        $validator = Validator::make($request->all(), [

            'analyte_name'=> 'required|string|max:255',
            'cas_number'=> 'nullable|string|max:50|regex:/^[\d-]+$/',
            'is_active'=> 'required|integer|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 421);
        }

        // Extract parameters from the request
        $param1 = $request->input('analyte_name');
        $param2 = $request->input('cas_number');
        $param3 = $request->input('is_active');
        $params = [$analyte_id, $param1, $param2, $param3];

        // Update analyte information
        DB::table('analytes')
            ->where('analyte_id', $analyte_id)
            ->update([
                'analyte_name' => $param1,
                'cas_number' => $param2,
                'is_active' => $param3,
            ]);

        // Update related tables if p_is_active is 0 or 1
            DB::table('categories')
            ->where('analyte_id', $analyte_id)
            ->update(['is_active' => $request->input('is_active')]);

            // Update methods table
            DB::table('methods')
                ->where('analyte_id', $analyte_id)
                ->update(['is_active' => $request->input('is_active')]);

            // Update turn_around_times table
            DB::table('turn_around_times')
            ->join('methods', 'turn_around_times.method_id', '=', 'methods.method_id')
            ->where('methods.analyte_id', $analyte_id)
            ->update(['turn_around_times.is_active' => $request->input('is_active')]);

            return response()->json('Analyte updated successfully with params: ' . implode(', ', $params), 200);
    }

    // Consider renaming your function for clarity
    public function searchTool(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'searchValue' => 'required|string|max:255',
            'searchType' => 'required|in:Contains,Exact', // Make sure searchType is either Contains or Exact
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $searchString = trim($request->input('searchValue'));
        $searchType = $request->input('searchType');

        $query = DB::table('analytes as a')
            ->select('a.analyte_id', 'a.analyte_name', 'a.cas_number', 'm.method_name', 'm.matrix', 'c.category_name', 's.synonym')
            ->leftJoin('methods as m', function ($join) {
                $join->on('a.analyte_id', '=', 'm.analyte_id');
            })
            ->leftJoin('categories as c', function ($join) {
                $join->on('a.analyte_id', '=', 'c.analyte_id');
            })
            ->leftJoin('synonyms as s', 'c.category_id', '=', 's.category_id')
            ->where('a.is_active', '=', 1) // Filter active analytes
            ->where(function ($query) {
                $query->where('m.is_active', '=', 1) // Filter active methods
                    ->orWhereNull('m.is_active'); // Include methods with NULL is_active (assuming they are considered active)
            })
            ->where(function ($query) {
                $query->where('c.is_active', '=', 1) // Filter active categories
                    ->orWhereNull('c.is_active'); // Include categories with NULL is_active (assuming they are considered active)
            });
        if ($searchType === 'Contains') {
            $this->applyContainsSearch($query, $searchString);
        } elseif ($searchType === 'Exact') {
            $this->applyExactSearch($query, $searchString);
        } else {
            return response()->json(['message' => 'Invalid search type'], 400);
        }

        $results = $query->get()->groupBy('analyte_id')->map(function ($items) use ($searchString) {
            $foundIn = [];

            // Initialize an array to keep track of processed analyte IDs
            $processedAnalyteIds = [];

            foreach ($items as $item) {
                // Check if the current analyte ID has been processed before
                if (!in_array($item->analyte_id, $processedAnalyteIds)) {
                    // Add the analyte ID to the list of processed IDs
                    $processedAnalyteIds[] = $item->analyte_id;

                    // Process the analyte and add it to the results
                    if (stripos($item->analyte_name, $searchString) !== false) {
                        $foundIn[] = 'Analyte Name';
                    }
                    if (stripos($item->matrix, $searchString) !== false) {
                        $foundIn[] = 'Matrix';
                    }
                    if (stripos($item->cas_number, $searchString) !== false) {
                        $foundIn[] = 'CAS Number';
                    }
                    if (stripos($item->category_name, $searchString) !== false) {
                        $foundIn[] = 'Category Name';
                    }
                    if (stripos($item->method_name, $searchString) !== false) {
                        $foundIn[] = 'Method Name';
                    }
                    if (stripos($item->synonym, $searchString) !== false) {
                        $foundIn[] = 'Synonyms Name';
                    }

                    // Set the 'found_in' property of the analyte
                    $item->found_in = implode(', ', $foundIn);
                } else {
                    // If the analyte ID has been processed, skip processing it again
                    continue;
                }
            }

            return $items->first();
        });

        if ($results->isEmpty()) {
            return response()->json(['message' => 'No results found'], 200);
        } else {
            return response()->json($results, 200);
        }
    }

    // Move these functions outside the searchTool function
    private function applyContainsSearch($query, $searchString)
    {
        $query->where(function ($query) use ($searchString) {
            $query->where('a.analyte_name', 'LIKE', '%' . $searchString . '%')
                ->orWhere('m.method_name', 'LIKE', '%' . $searchString . '%')
                ->orWhere('m.matrix', 'LIKE', '%' . $searchString . '%')
                ->orWhere('a.cas_number', 'LIKE', '%' . $searchString . '%')
                ->orWhere('s.synonym', 'LIKE', '%' . $searchString . '%');
        });
    }

    private function applyExactSearch($query, $searchString)
    {
        $query->where(function ($query) use ($searchString) {
            $query->where('a.analyte_name', '=', $searchString)
                ->orWhere('m.method_name', '=', $searchString)
                ->orWhere('m.matrix', '=', $searchString)
                ->orWhere('a.cas_number', '=', $searchString)
                ->orWhere('s.synonym', '=', $searchString);
        });
    }

    public function searchAnalyte($searchValue)
    {
        $analyte = Analytes::where('analyte_name', 'like', '%' . $searchValue. '%')->get();

        if (!empty($analyte)) {
            return response()->json($analyte);
        } else {
            return response()->json(['message' => 'No analyte found'], 404);
        }
    }

    public function destroy($analyte_id): JsonResponse
    {
        if (!is_numeric($analyte_id) || (int)$analyte_id < 1) {
            return response()->json(['message' => 'Please enter a valid analyte id'], 400);
        }

        $exists = DB::table('analytes')->where('analyte_id', (int)$analyte_id)->exists();
        if (!$exists) {
            return response()->json(['message' => 'Not found'], 404);
        }

        try {
            DB::table('analytes')->where('analyte_id', (int)$analyte_id)->delete();
            return response()->json(['message' => 'Deleted'], 200);
        } catch (\Throwable $e) {
            // Likely an FK constraint (methods, categories, etc.)
            return response()->json(['message' => 'Cannot delete this analyte right now'], 409);
        }
    }

    public function show($id): JsonResponse
{
    try {
        if (!is_numeric($id) || (int)$id < 1) {
            return response()->json(['message' => 'Invalid analyte id'], 400);
        }

        $analyte = Analytes::query()->find((int)$id);

        if (!$analyte) {
            return response()->json(['message' => 'Analyte not found'], 404);
        }

        return response()->json($analyte, 200);
    } catch (\Throwable $e) {
        \Log::error('GET /api/analyte/{id} failed', ['id' => $id, 'error' => $e->getMessage()]);
        return response()->json(['message' => 'Server error'], 500);
    }
}
}
