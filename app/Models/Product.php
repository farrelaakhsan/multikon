<?php

namespace App\Models;

use App\Traits\HasUuidPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasUuidPrimaryKey;
    protected $primaryKey = 'product_id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $uuidRouteKeyName = 'product_id';

    const DISPLAY_COLUMNS = [
        'product_id',
        'product_name',
        'slug',
        'category',
        'description',
        'image',
        'price',
        'specifications',
        'is_customizable',
        'stock',
        'weight',
        'warranty',
        'usage_instructions',
    ];

    protected $fillable = [
        'product_name',
        'slug',
        'category',
        'description',
        'image',
        'price',
        'specifications',
        'is_customizable',
        'stock',
        'weight',
        'warranty',
        'usage_instructions',
    ];

    protected $casts = [
        'price'           => 'decimal:2',
        'weight'          => 'decimal:2',
        'is_customizable' => 'boolean',
    ];

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        return Storage::url($this->image);
    }

    protected $appends = ['image_url'];

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            if (empty($product->slug) && !empty($product->product_name)) {
                $base = Str::slug($product->product_name);
                $slug = $base;
                $i = 2;
                while (static::where('slug', $slug)->where('product_id', '!=', $product->product_id ?? '')->exists()) {
                    $slug = $base . '-' . $i++;
                }
                $product->slug = $slug;
            }
        });
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'product_id', 'product_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_id', 'product_id');
    }

    public function decrementStock(int $quantity): bool
    {
        if ($this->is_customizable) {
            return true;
        }

        if ((int) $this->stock < $quantity) {
            return false;
        }

        $this->decrement('stock', $quantity);

        return true;
    }

    public function restoreStock(int $quantity): void
    {
        if ($this->is_customizable) {
            return;
        }

        $this->increment('stock', $quantity);
    }
}
