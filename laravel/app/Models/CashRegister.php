<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashRegister extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function cashShifts(): HasMany
    {
        return $this->hasMany(CashShift::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }
}
