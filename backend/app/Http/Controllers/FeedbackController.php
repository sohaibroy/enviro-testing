<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:10', // Ensure rating is between 1 and 10
            'comment' => 'nullable|string|max:500', // Comment is optional, up to 500 characters
        ]);

        $feedback = Feedback::create([
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json(['message' => 'Feedback submitted successfully'], 200);
    }
}
