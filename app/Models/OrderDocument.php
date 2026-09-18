<?php

namespace App\Models;

use App\Traits\HasUuidPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderDocument extends Model
{
    use HasUuidPrimaryKey;
    protected $primaryKey = 'order_document_id';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $uuidRouteKeyName = 'order_document_id';

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
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    public function getFileUrlAttribute(): ?string
    {
        if (! $this->file_path) {
            return null;
        }

        return asset('storage/' . $this->file_path);
    }

    public function getDownloadNameAttribute(): string
    {
        return basename($this->file_path);
    }
}
