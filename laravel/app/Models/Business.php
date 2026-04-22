<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Business extends Model
{
    protected $table = 'business';

    protected $fillable = [
        'name',
        'legal_name',
        'tax_id',
        'email',
        'phone',
        'currency',
        'timezone',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function cashRegisters(): HasMany
    {
        return $this->hasMany(CashRegister::class);
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    public function paymentMethods(): HasMany
    {
        return $this->hasMany(PaymentMethod::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }
}
