<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect('/login');
        }

        // Admins pass everything
        if ($user->role === 'admin') {
            return $next($request);
        }

        if (!in_array($user->role, $roles)) {
            if ($user->role === 'kitchen') {
                return redirect('/kitchen');
            }
            if ($user->role === 'cashier') {
                return redirect('/pos');
            }
            abort(403, 'Unauthorized Access.');
        }

        return $next($request);
    }
}
