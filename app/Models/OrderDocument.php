<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderDocument extends Model
{
    protected $fillable = [
        'order_id',
        'type',
        'document_number',
        'file_path',
        'issued_at',
        'metadata',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'metadata'  => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * URL publik lengkap untuk file PDF tersimpan.
     */
    public function getFileUrlAttribute(): ?string
    {
        if (! $this->file_path) {
            return null;
        }

        return asset('storage/' . $this->file_path);
    }

    /**
     * Nama file untuk keperluan unduhan (download).
     */
    public function getDownloadNameAttribute(): string
    {
        return basename($this->file_path);
    }
}