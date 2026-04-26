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
            'amount_cash_declared' => 'required|numeric|min:0',
        ]);

        $user = $request->user();
        if ($shift->cashRegister->business_id !== $user->business_id) {
            abort(403);
        }

        $payments = \App\Models\Payment::whereIn('sale_id', $shift->sales()->pluck('id'))
            ->join('payment_methods', 'payments.payment_method_id', '=', 'payment_methods.id')
            ->select('payments.amount', 'payment_methods.code')
            ->get();

        $cashSales = $payments->where('code', 'CASH')->sum('amount');
        $cardSales = $payments->where('code', 'CARD')->sum('amount');
        $transferSales = $payments->where('code', 'TRANSFER')->sum('amount');

        $expensesTotal = $shift->expenses()->sum('amount');

        $amountCashCalculated = $shift->opening_amount + $cashSales - $expensesTotal;
        $amountCardCalculated = $cardSales;
        $amountTransferCalculated = $transferSales;
        
        $closingAmountCalculated = $amountCashCalculated + $amountCardCalculated + $amountTransferCalculated;

        $amountCashDeclared = $request->amount_cash_declared;
        $amountCardDeclared = $amountCardCalculated;
        $amountTransferDeclared = $amountTransferCalculated;

        $closingAmountDeclared = $amountCashDeclared + $amountCardDeclared + $amountTransferDeclared;

        $difference = $closingAmountDeclared - $closingAmountCalculated;

        $shift->update([
            'closed_by' => $user->id,
            'closed_at' => now(),
            'amount_cash_declared' => $amountCashDeclared,
            'amount_card_declared' => $amountCardDeclared,
            'amount_transfer_declared' => $amountTransferDeclared,
            'closing_amount_declared' => $closingAmountDeclared,
            'amount_cash_calculated' => $amountCashCalculated,
            'amount_card_calculated' => $amountCardCalculated,
            'amount_transfer_calculated' => $amountTransferCalculated,
            'closing_amount_calculated' => $closingAmountCalculated,
            'difference' => $difference,
        ]);

        return redirect()->back()->with('success', 'Register closed.');
    }
}
