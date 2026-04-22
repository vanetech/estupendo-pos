<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (Business::count() === 0) {
            Business::create([
                'name' => 'Local Principal',
                'currency' => 'COP'
            ]);
        }
        
        $b = Business::first();

        if (!User::where('email', 'admin@estupendo.pos')->exists()) {
            User::create([
                'name' => 'Administrador Total',
                'email' => 'admin@estupendo.pos',
                'password' => Hash::make('12345678'),
                'business_id' => $b->id,
                'role' => 'admin',
                'active' => true,
            ]);
        }
    }
}
