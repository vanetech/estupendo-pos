<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\CashRegister;
use App\Models\CashShift;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index()
    {
        // For simplicity, we assume the first business and an open cash shift exists.
        $business = request()->user()->business;
        if (!$business) {
            $business = Business::create(['name' => 'Pizza Pos', 'active' => true]);
        }

        $products = Product::where('business_id', $business->id)->where('active', true)->get();
        $paymentMethods = PaymentMethod::where('business_id', $business->id)->get();
        
        $openShift = CashShift::whereNull('closed_at')->latest()->first();

        return Inertia::render('POS/Index', [
            'products' => $products,
            'paymentMethods' => $paymentMethods,
            'business' => $business,
            'openShift' => $openShift,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'business_id' => 'required|exists:business,id',
            'cash_shift_id' => 'required|exists:cash_shifts,id',
            'cart' => 'required|array',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric',
            'cart.*.description' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0',
            'extra_charge' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'payments' => 'required|array|min:1',
            'payments.*.payment_method_id' => 'required|exists:payment_methods,id',
            'payments.*.amount' => 'required|numeric|min:0'
        ]);

        $shift = CashShift::findOrFail($request->cash_shift_id);

        $sale = DB::transaction(function () use ($request, $shift) {
            $subTotalAmount = collect($request->cart)->sum(fn($item) => $item['price'] * $item['quantity']);
            $discount = $request->discount ?? 0;
            $extraCharge = $request->extra_charge ?? 0;
            $totalAmount = max(0, $subTotalAmount - $discount + $extraCharge);

            $totalTendered = collect($request->payments)->sum('amount');
            if ($totalAmount > 0 && $totalTendered < $totalAmount) {
                throw new \Exception("Insufficient payment amount.");
            }

            $sale = Sale::create([
                'business_id' => $request->business_id,
                'cash_register_id' => $shift->cash_register_id,
                'cash_shift_id' => $shift->id,
                'total_amount' => $totalAmount,
                'discount' => $discount,
                'extra_charge' => $extraCharge,
                'status' => 'PAID',
                'notes' => $request->notes,
            ]);

            foreach ($request->cart as $item) {
                $product = Product::find($item['id']);
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'description' => $item['description'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);
                
                // Decrement stock
                if ($product->stock !== null) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            $balanceToSave = $totalAmount;
            foreach ($request->payments as $p) {
                if ($balanceToSave <= 0) break;
                
                $amountToSave = min($p['amount'], $balanceToSave);
                if ($amountToSave > 0) {
                    $sale->payments()->create([
                        'payment_method_id' => $p['payment_method_id'],
                        'amount' => $amountToSave,
                    ]);
                    $balanceToSave -= $amountToSave;
                }
            }
            
            return $sale;
        });

        return redirect()->back()->with('success', 'Orden #' . str_pad($sale->id, 5, '0', STR_PAD_LEFT) . ' registrada exitosamente.');
    }
}
