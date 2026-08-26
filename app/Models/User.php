<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    public const B2B_STATUS_NONE     = 'none';
    public const B2B_STATUS_PENDING  = 'pending';
    public const B2B_STATUS_APPROVED = 'approved';
    public const B2B_STATUS_REJECTED = 'rejected';

    public const TOP_DEFAULT_TENURE_DAYS = 30;

    /**
     * Skema pembayaran Termin default untuk produk Custom.
     * 40% DP -> 40% Produksi -> 20% Pelunasan.
     */
    public const TERMIN_SCHEME = [
        ['key' => 'dp',          'label' => 'DP / Pembayaran Awal',       'percent' => 40],
        ['key' => 'progress',    'label' => 'Produksi',           'percent' => 40],
        ['key' => 'final',       'label' => 'Pelunasan',         'percent' => 20],
    ];

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'b2b_status',
        'credit_limit',
        'remaining_credit',
        'top_tenure_days',
        'top_disabled',
        'b2b_approved_at',
        'rejection_reason',
        'terms_accepted_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'is_b2b_verified',
        'b2b_status_label',
        'termin_scheme',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_admin'          => 'boolean',
            'credit_limit'      => 'decimal:2',
            'remaining_credit'  => 'decimal:2',
            'top_tenure_days'   => 'integer',
            'top_disabled'      => 'boolean',
            'b2b_approved_at'   => 'datetime',
            'terms_accepted_at' => 'datetime',
        ];
    }

    public function getIsB2bVerifiedAttribute(): bool
    {
        return $this->b2b_status === self::B2B_STATUS_APPROVED;
    }

    public function getB2bStatusLabelAttribute(): string
    {
        return match ($this->b2b_status) {
            self::B2B_STATUS_NONE     => 'Belum Mengajukan',
            self::B2B_STATUS_PENDING  => 'Sedang Ditinjau',
            self::B2B_STATUS_APPROVED => 'Terverifikasi',
            self::B2B_STATUS_REJECTED => 'Ditolak',
            default                   => $this->b2b_status,
        };
    }

    public function getTerminSchemeAttribute(): array
    {
        return self::TERMIN_SCHEME;
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function b2bApplications(): HasMany
    {
        return $this->hasMany(B2bApplication::class)->latest();
    }

    public function latestB2bApplication(): HasOne
    {
        return $this->hasOne(B2bApplication::class)->latestOfMany();
    }
}