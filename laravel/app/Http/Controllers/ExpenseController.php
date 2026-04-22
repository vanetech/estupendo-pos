<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\CashShift;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $business = request()->user()->business;
        $expenses = Expense::with(['category', 'paymentMethod', 'shift'])->where('business_id', $business?->id)->latest()->get();
        $categories = ExpenseCategory::where('business_id', $business?->id)->get();
        $paymentMethods = PaymentMethod::where('business_id', $business?->id)->get();
        $openShift = CashShift::whereNull('closed_at')->latest()->first();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'categories' => $categories,
            'paymentMethods' => $paymentMethods,
            'openShift' => $openShift,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'amount' => 'required|numeric|min:0',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'expense_date' => 'required|date',
            'description' => 'required|string',
        ]);

        $business = request()->user()->business;
        $shift = CashShift::whereNull('closed_at')->latest()->first();

        Expense::create([
            'business_id' => $business->id,
            'expense_category_id' => $request->expense_category_id,
            'cash_shift_id' => $shift?->id ?? 1, // Fallback if ignoring shifts
            'payment_method_id' => $request->payment_method_id,
            'created_by' => 1,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Expense recorded!');
    }
}
