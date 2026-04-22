<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            // Log successful attempt mapped to user id
            $user = Auth::user();
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'LOGIN',
                'entity_type' => 'user',
                'entity_id' => $user->id,
                'description' => 'User logged into terminal securely.',
                'data' => json_encode(['ip' => $request->ip()])
            ]);

            return redirect()->intended('/pos');
        }

        return back()->withErrors([
            'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'LOGOUT',
                'entity_type' => 'user',
                'entity_id' => $user->id,
                'description' => 'User disconnected seamlessly.',
            ]);
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
