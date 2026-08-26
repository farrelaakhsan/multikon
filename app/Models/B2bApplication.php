<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class B2bApplication extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'company_name',
        'company_npwp',
        'company_nib',
        'npwp_file',
        'nib_file',
        'siup_file',
        'credit_limit',
        'top_tenure_days',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'credit_limit'    => 'decimal:2',
        'top_tenure_days' => 'integer',
        'reviewed_at'     => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending'  => 'Menunggu Peninjauan',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            default    => $this->status,
        };
    }

    public function getNpwpFileUrlAttribute(): ?string
    {
        return $this->fileUrl($this->npwp_file);
    }

    public function getNibFileUrlAttribute(): ?string
    {
        return $this->fileUrl($this->nib_file);
    }

    public function getSiupFileUrlAttribute(): ?string
    {
        return $this->fileUrl($this->siup_file);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    private function fileUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        return Storage::url($path);
    }
}
