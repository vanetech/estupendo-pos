<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashShift extends Model
{
    protected $fillable = [
        'cash_register_id',
        'opened_by',
        'closed_by',
        'opening_amount',
        'opened_at',
        'closed_at',
        'amount_cash_declared',
        'amount_card_declared',
        'amount_transfer_declared',
        'closing_amount_declared',
        'amount_cash_calculated',
        'amount_card_calculated',
        'amount_transfer_calculated',
        'closing_amount_calculated',
        'difference',
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function cashRegister(): BelongsTo
    {
        return $this->belongsTo(CashRegister::class);
    }

    public function openedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'opened_by');
    }

    public function closedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'closed_by');
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
