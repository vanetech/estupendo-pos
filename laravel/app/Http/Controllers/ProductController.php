<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $business = request()->user()->business;
        $products = Product::where('business_id', $business?->id)
            ->orderBy('active', 'desc')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock' => 'required|integer',
            'photo' => 'nullable|image|max:2048'
        ]);

        $business = request()->user()->business;
        $data = $request->except('photo');
        $data['business_id'] = $business->id;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('products', 'public');
            $data['image_path'] = $path;
        }

        Product::create($data);

        return redirect()->back()->with('success', 'Product created');
    }

    public function update(Request $request, Product $product)
    {
        $business = request()->user()->business;
        if ($product->business_id !== $business->id) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock' => 'required|integer',
            'photo' => 'nullable|image|max:2048'
        ]);

        $data = $request->except('photo');

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $path = $request->file('photo')->store('products', 'public');
            $data['image_path'] = $path;
        }

        $product->update($data);

        return redirect()->back()->with('success', 'Product updated');
    }

    public function destroy(Product $product)
    {
        $business = request()->user()->business;
        if ($product->business_id !== $business->id) {
            abort(403);
        }

        $product->update(['active' => !$product->active]);
        return redirect()->back()->with('success', 'Product status toggled');
    }
}
