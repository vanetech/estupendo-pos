<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'description',
        'price',
        'cost',
        'sku',
        'barcode',
        'stock',
        'min_stock',
        'active',
        'image_path',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
