<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'description',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public const UPDATED_AT = null; // activity_logs solo usa created_at según la migración

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
