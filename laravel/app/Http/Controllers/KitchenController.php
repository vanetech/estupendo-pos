<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Only fetch sales belonging to the current business, which are PAID, 
        // and aren't completely archived as DELIVERED to keep the UI clean natively.
        $orders = Sale::with('items')
            ->where('business_id', $user->business_id)
            ->where('status', 'PAID')
            ->whereIn('preparation_status', ['PENDING', 'PREPARING', 'READY'])
            ->orderBy('created_at', 'asc') // First appended is First served conceptually (FIFO)
            ->get();

        return Inertia::render('Kitchen/Index', [
            'orders' => $orders
        ]);
    }

    public function updateStatus(Request $request, Sale $sale)
    {
        $user = $request->user();
        if ($sale->business_id !== $user->business_id) {
            abort(403);
        }

        $request->validate([
            'preparation_status' => 'required|in:PENDING,PREPARING,READY,DELIVERED'
        ]);

        $sale->update([
            'preparation_status' => $request->preparation_status
        ]);

        return redirect()->back();
    }
}
