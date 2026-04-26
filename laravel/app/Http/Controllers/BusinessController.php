<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BusinessController extends Controller
{
    public function index()
    {
        // Administradores pueden ver todos los business units
        $businesses = Business::all();

        return Inertia::render('Business/Index', [
            'businesses' => $businesses
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'currency' => 'nullable|string|max:10',
            'active' => 'boolean',
        ]);

        Business::create([
            'name' => $data['name'],
            'currency' => $data['currency'] ?? 'COP',
            'active' => $data['active'] ?? true,
        ]);

        return back()->with('success', 'Nueva sucursal generada correctamente.');
    }

    public function switchBusiness(Request $request)
    {
        $request->validate([
            'business_id' => 'required|exists:business,id'
        ]);

        $user = Auth::user();

        // Only admins can natively swap businesses like this
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        $user->business_id = $request->business_id;
        $user->save();

        return back()->with('success', 'Contexto operativo cambiado con éxito.');
    }
}
