<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBannedSector
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user && $user->sector && $user->sector->status === false) {
            return response()->json([
                'message' => 'Action impossible : Votre secteur est actuellement inactif ou gelé.'
            ], 403);
        }

        return $next($request);
    }
}
