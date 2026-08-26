<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class OrderItem extends Model
{
    public const LINE_READY = 'ready_stock';
    public const LINE_CUSTOM = 'custom';

    protected $fillable = [
        'order_id',
        'product_id',
        'line_type',
        'product_name',
        'quantity',
        'unit_price',
        'custom_price',
        'custom_requirements',
        'custom_specifications',
        'custom_notes',
        'reference_file',
        'dpp',
        'ppn',
    ];

    protected $casts = [
        'quantity'    => 'integer',
        'unit_price'  => 'decimal:2',
        'custom_price'=> 'decimal:2',
        'dpp'         => 'decimal:2',
        'ppn'         => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getIsCustomAttribute(): bool
    {
        return $this->line_type === self::LINE_CUSTOM;
    }

    public function getSubtotalAttribute(): float
    {
        $price = $this->line_type === self::LINE_CUSTOM
            ? (float) ($this->custom_price ?? $this->unit_price ?? 0)
            : (float) ($this->unit_price ?? 0);

        return $price * (int) ($this->quantity ?? 1);
    }

    public function getProductImageUrlAttribute(): ?string
    {
        return $this->product?->image_url ?? null;
    }

    public function getReferenceFileUrlAttribute(): ?string
    {
        if (! $this->reference_file) {
            return null;
        }

        if (filter_var($this->reference_file, FILTER_VALIDATE_URL)) {
            return $this->reference_file;
        }

        return asset('storage/reference_files/' . $this->reference_file);
    }
}
