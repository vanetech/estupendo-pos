<?php

use App\Http\Controllers\CashShiftController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('pos.index');
});

// Windows/Docker Native Image Streamer Bypass
Route::get('/storage/products/{filename}', function ($filename) {
    $path = storage_path('app/public/products/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['auth'])->group(function () {
    // POS & Sales
    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('/pos/sales', [PosController::class, 'store'])->name('pos.store');

    // Cash Shifts (Registers)
    Route::get('/cash-shifts', [CashShiftController::class, 'index'])->name('cash-shifts.index');
    Route::post('/cash-shifts/open', [CashShiftController::class, 'store'])->name('cash-shifts.open');
    Route::post('/cash-shifts/{shift}/close', [CashShiftController::class, 'close'])->name('cash-shifts.close');

    // Inventory
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Expenses
    Route::get('/expenses', [ExpenseController::class, 'index'])->name('expenses.index');
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{date}', [ReportController::class, 'show'])->name('reports.show');
});
