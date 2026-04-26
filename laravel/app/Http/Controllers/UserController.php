<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Administradores pueden ver usuarios (tal vez de todos los business o solo el suyo, 
        // pero como los admins pueden saltar, listemos los del business actual para ser más limpios, o todos)
        // Optaremos por listar TODOS los usuarios registrados para el administrador.
        $users = User::with('business')->get();
        $businesses = Business::all();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'businesses' => $businesses
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'business_id' => 'required|exists:business,id',
            'role' => 'required|in:admin,cashier,kitchen',
        ]);

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'business_id' => $data['business_id'],
            'role' => $data['role'],
            'active' => true,
        ]);

        return back()->with('success', 'Usuario creado correctamente.');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'business_id' => 'required|exists:business,id',
            'role' => 'required|in:admin,cashier,kitchen',
            'password' => 'nullable|string|min:6',
            'active' => 'boolean'
        ]);

        $user->name = $data['name'];
        $user->business_id = $data['business_id'];
        $user->role = $data['role'];
        if (isset($data['active'])) {
             $user->active = $data['active'];
        }

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return back()->with('success', 'Usuario actualizado.');
    }
}
