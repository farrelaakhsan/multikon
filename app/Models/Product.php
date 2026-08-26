<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    const DISPLAY_COLUMNS = [
        'id',
        'name',
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
        'name',
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

    /**
     * Otomatis tambahkan image_url ke setiap response.
     * Kalau image = URL eksternal (http) → langsung pakai.
     * Kalau image = path storage (products/xxx.jpg) → tambahkan /storage/ di depan.
     * Kalau image = null → kirim null, frontend pakai fallback.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        // Kalau sudah berupa URL lengkap (https://...)
        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        // Kalau path storage
        return Storage::url($this->image);
    }

    protected $appends = ['image_url'];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Kurangi stok produk jika stok mencukupi.
     * Mengembalikan true jika berhasil, false jika stok tidak cukup.
     */
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

    /**
     * Kembalikan stok produk (untuk pembatalan pesanan).
     */
    public function restoreStock(int $quantity): void
    {
        if ($this->is_customizable) {
            return;
        }

        $this->increment('stock', $quantity);
    }
}