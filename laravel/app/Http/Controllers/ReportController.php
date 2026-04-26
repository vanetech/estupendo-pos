<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Expense;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $business = request()->user()->business;

        $currentMonth = now()->month;
        $currentYear = now()->year;

        $totalSales = Sale::where('business_id', $business?->id)
            ->where('status', 'PAID')
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->sum('total_amount');

        $totalExpenses = Expense::where('business_id', $business?->id)
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->sum('amount');

        $profit = $totalSales - $totalExpenses;

        $salesByDay = Sale::where('business_id', $business?->id)
            ->where('status', 'PAID')
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->pluck('total', 'date')
            ->toArray();

        $expensesByDay = Expense::where('business_id', $business?->id)
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
            ->groupBy('date')
            ->pluck('total', 'date')
            ->toArray();

        $dates = array_unique(array_merge(array_keys($salesByDay), array_keys($expensesByDay)));
        rsort($dates);

        $dailyStats = [];
        foreach ($dates as $date) {
            $s = (float)($salesByDay[$date] ?? 0);
            $e = (float)($expensesByDay[$date] ?? 0);
            $dailyStats[] = [
                'date' => $date,
                'sales' => $s,
                'expenses' => $e,
                'profit' => $s - $e,
            ];
        }

        return Inertia::render('Reports/Index', [
            'stats' => [
                'totalSales' => $totalSales,
                'totalExpenses' => $totalExpenses,
                'profit' => $profit,
            ],
            'dailyStats' => $dailyStats
        ]);
    }

    public function show($date)
    {
        $business = request()->user()->business;

        // Eager load related items & payments (with payment details) using exact date
        $sales = Sale::with(['items', 'payments.paymentMethod'])
            ->where('business_id', $business?->id)
            ->where('status', 'PAID')
            ->whereDate('created_at', $date)
            ->orderBy('created_at', 'desc')
            ->get();

        // Eager load category using exact date
        $expenses = Expense::with('category', 'paymentMethod')
            ->where('business_id', $business?->id)
            ->whereDate('created_at', $date)
            ->orderBy('created_at', 'desc')
            ->get();

        $totals = [
            'sales' => $sales->sum('total_amount'),
            'expenses' => $expenses->sum('amount'),
        ];
        $totals['profit'] = $totals['sales'] - $totals['expenses'];

        return Inertia::render('Reports/DailyView', [
            'date' => $date,
            'sales' => $sales,
            'expenses' => $expenses,
            'totals' => $totals,
        ]);
    }
}
