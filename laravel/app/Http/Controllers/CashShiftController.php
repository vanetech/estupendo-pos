<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\CashRegister;
use App\Models\CashShift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashShiftController extends Controller
{
    public function index()
    {
        $business = request()->user()->business;
        $registers = CashRegister::where('business_id', $business?->id)->get();
        $shifts = CashShift::with(['cashRegister', 'openedBy', 'closedBy'])->latest()->limit(10)->get();
        $currentShift = CashShift::whereNull('closed_at')->latest()->first();

        return Inertia::render('CashShifts/Index', [
            'registers' => $registers,
            'shifts' => $shifts,
            'currentShift' => $currentShift,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cash_register_id' => 'required|exists:cash_registers,id',
            'opening_amount' => 'required|numeric|min:0',
        ]);

        if (CashShift::whereNull('closed_at')->where('cash_register_id', $request->cash_register_id)->exists()) {
            return back()->withErrors(['cash_register_id' => 'This register is already open.']);
        }

        CashShift::create([
            'cash_register_id' => $request->cash_register_id,
            'opened_by' => 1, // hardcoded user for now
            'opening_amount' => $request->opening_amount,
            'opened_at' => now(),
        ]);

        return redirect()->route('pos.index')->with('success', 'Register opened!');
    }

    public function close(Request $request, CashShift $shift)
    {
        $request->validate([
            'closing_amount_declared' => 'required|numeric|min:0',
        ]);

        // Calculate expected from sales
        $salesTotal = $shift->sales()->sum('total_amount');
        // Simple logic for difference (Opening + Sales - Declared) -> real diff might include expenses
        $expensesTotal = $shift->expenses()->sum('amount');
        
        $expectedAmount = $shift->opening_amount + $salesTotal - $expensesTotal;
        $difference = $request->closing_amount_declared - $expectedAmount;

        $shift->update([
            'closed_by' => 1,
            'closed_at' => now(),
            'amount_cash_declared' => $request->closing_amount_declared,
            'closing_amount_declared' => $request->closing_amount_declared,
            'amount_cash_calculated' => $expectedAmount,
            'closing_amount_calculated' => $expectedAmount,
            'difference' => $difference,
        ]);

        return redirect()->back()->with('success', 'Register closed.');
    }
}
