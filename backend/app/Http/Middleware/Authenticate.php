<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    public function handle($request, Closure $next, ...$guards)
    {
        if (!$request->bearerToken()) {
            return response()->json(['error' => 'Token is missing'], 401);
        }

        return parent::handle($request, $next, ...$guards);
    }
}