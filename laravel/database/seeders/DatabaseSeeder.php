<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\CashRegister;
use App\Models\Client;
use App\Models\ExpenseCategory;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $business = Business::firstOrCreate(
            ['id' => 1],
            ['name' => 'Pizza Estupenda', 'active' => true, 'currency' => 'COP']
        );

        User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            ['id' => 1, 'business_id' => $business->id, 'name' => 'Admin Cajero', 'password' => Hash::make('password')]
        );

        CashRegister::firstOrCreate(
            ['id' => 1],
            ['business_id' => $business->id, 'name' => 'Caja Principal', 'active' => true]
        );

        // Payment Methods
        $methods = [
            ['name' => 'Efectivo', 'code' => 'CASH'],
            ['name' => 'Tarjeta Crédito/Débito', 'code' => 'CARD'],
            ['name' => 'Transferencia / Nequi', 'code' => 'TRANSFER'],
        ];

        foreach ($methods as $method) {
            PaymentMethod::firstOrCreate(
                ['name' => $method['name']],
                ['business_id' => $business->id, 'code' => $method['code'], 'active' => true]
            );
        }

        // Expense Categories
        $expenses = ['Ingredientes', 'Servicios Públicos', 'Nómina', 'Alquiler', 'Mantenimiento'];
        foreach ($expenses as $expense) {
            ExpenseCategory::firstOrCreate(
                ['name' => $expense],
                ['business_id' => $business->id, 'active' => true]
            );
        }

        // Clients
        Client::firstOrCreate(
            ['document_number' => '22222222'],
            ['business_id' => $business->id, 'name' => 'Cliente General', 'document_type' => 'CC', 'active' => true]
        );

        // Products
        $products = [
            ['name' => 'Pizza Peperoni Grande', 'price' => 35000, 'cost' => 15000, 'stock' => 50],
            ['name' => 'Pizza Hawaiana Extra', 'price' => 38000, 'cost' => 16000, 'stock' => 45],
            ['name' => 'Pizza Champiñones', 'price' => 32000, 'cost' => 14000, 'stock' => 30],
            ['name' => 'Porción de Pizza Clásica', 'price' => 6000, 'cost' => 2000, 'stock' => 100],
            ['name' => 'Gaseosa Litro', 'price' => 8000, 'cost' => 4000, 'stock' => 20],
            ['name' => 'Cerveza Nacional Artesanal', 'price' => 9000, 'cost' => 4500, 'stock' => 40],
            ['name' => 'Palitos de Queso (x4)', 'price' => 12000, 'cost' => 5000, 'stock' => 60],
            ['name' => 'Limonada Natural', 'price' => 6500, 'cost' => 1500, 'stock' => 30],
        ];

        foreach ($products as $prod) {
            Product::firstOrCreate(
                ['name' => $prod['name']],
                ['business_id' => $business->id, 'price' => $prod['price'], 'cost' => $prod['cost'], 'stock' => $prod['stock'], 'active' => true]
            );
        }
    }
}
