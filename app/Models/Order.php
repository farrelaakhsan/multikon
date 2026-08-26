<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    public const PAYMENT_TOP    = 'top';
    public const PAYMENT_TERMIN = 'termin';

    public const STATUS_PO_VERIFICATION   = 'po_verification';
    public const STATUS_WAITING_SETTLEMENT = 'waiting_settlement';

    protected $fillable = [
        'order_code',
        'order_type',
        'user_id',
        'product_id',
        'customer_name',
        'whatsapp_number',
        'address',
        'shipping_method',
        'courier_name',
        'tracking_number',
        'driver_contact',
        'shipping_proof',
        'notes',
        'payment_method',
        'payment_status',
        'payment_proof',
        'sender_bank_name',
        'transfer_date',
        'status',
        'quantity',
        'custom_requirements',
        'custom_specifications',
        'custom_quantity',
        'custom_notes',
        'reference_file',
        'custom_price',
        'shipping_cost',
        'status_history',
        'estimated_weight',
        'subdistrict_id',
        'subdistrict_name',
        'district_name',
        'city_name',
        'has_unread_for_admin',
        'has_unread_for_user',
        'po_document',
        'po_verification_status',
        'po_verified_at',
        'credit_used',
        'credit_restored_at',
        'termin_bills',
        'paid_bills',
        'settlement_proof',
        'settlement_status',
        'settlement_verified_at',
        'shipped_at',
        'payment_deadline',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'custom_price' => 'decimal:2',
        'estimated_weight' => 'decimal:2',
        'status_history' => 'array',
        'has_unread_for_admin' => 'boolean',
        'has_unread_for_user' => 'boolean',
        'po_verified_at' => 'datetime',
        'credit_used' => 'decimal:2',
        'credit_restored_at' => 'datetime',
        'termin_bills' => 'array',
        'paid_bills' => 'array',
        'settlement_verified_at' => 'datetime',
        'shipped_at' => 'datetime',
        'payment_deadline' => 'datetime',
        'transfer_date' => 'date',
    ];

    /**
     * Label teks untuk payment method.
     */
    public function getPaymentLabelAttribute(): string
    {
        if (str_starts_with($this->payment_method, 'bank_')) {
            $index = (int) str_replace('bank_', '', $this->payment_method);
            $accounts = json_decode(\App\Models\PaymentSetting::getValue('bank_accounts') ?? '[]', true);
            if (isset($accounts[$index])) {
                return 'Transfer ' . $accounts[$index]['bank'];
            }
            return 'Transfer';
        }

        return match ($this->payment_method) {
            'qris' => 'QRIS',
            self::PAYMENT_TOP    => 'Pembayaran Tempo (ToP / Net 30)',
            self::PAYMENT_TERMIN => 'Pembayaran Termin Bertahap (40% - 40% - 20%)',
            default => $this->payment_method,
        };
    }

public function getStatusLabelAttribute(): string
{
    $labels = [
        'pending_payment'       => 'Menunggu Pembayaran',
        'waiting_confirmation'  => 'Menunggu Verifikasi',
        'processing'            => 'Diproses',
        'shipped'               => 'Dikirim / Pickup',
        'completed'             => 'Selesai',
        'cancelled'             => 'Dibatalkan',
        'custom_consultation'  => 'Konsultasi Custom',
        'confirmed'             => 'Dikonfirmasi',
        'in_progress'          => 'Diproses',
        'done'                  => 'Selesai',
        'waiting_review'       => 'Menunggu Peninjauan',
        'waiting_payment'       => 'Menunggu Pembayaran',
        'in_production'         => 'Sedang Diproduksi',
        'po_verification'       => 'Menunggu Verifikasi PO',
        'waiting_settlement'    => 'Menunggu Pelunasan (H+30)',
    ];

    return $labels[$this->status] ?? $this->status;
}

    /**
     * URL lengkap untuk bukti pembayaran.
     */
    public function getPaymentProofUrlAttribute(): ?string
    {
        if (! $this->payment_proof) {
            return null;
        }

        if (filter_var($this->payment_proof, FILTER_VALIDATE_URL)) {
            return $this->payment_proof;
        }

        return asset('storage/payment_proofs/' . $this->payment_proof);
    }

    /**
     * URL lengkap untuk dokumen Purchase Order (PO).
     */
    public function getPoDocumentUrlAttribute(): ?string
    {
        if (! $this->po_document) {
            return null;
        }

        if (filter_var($this->po_document, FILTER_VALIDATE_URL)) {
            return $this->po_document;
        }

        return asset('storage/' . $this->po_document);
    }

    /**
     * Label teks untuk status verifikasi dokumen PO.
     */
    public function getPoVerificationLabelAttribute(): string
    {
        return match ($this->po_verification_status) {
            'verified' => 'PO Diverifikasi',
            'pending'  => 'Menunggu Verifikasi PO',
            default    => 'Belum Verifikasi PO',
        };
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(OrderDocument::class)->latest('issued_at');
    }

    public function getTotalPriceAttribute(): float
    {
        $subtotal = $this->itemsSubtotal();

        return $subtotal + ($this->shipping_cost ?? 0);
    }

    /**
     * Subtotal seluruh line item pesanan.
     * Mengutamakan order_items; fallback ke kolom produk legacy
     * bila pesanan belum memiliki baris item.
     */
    public function itemsSubtotal(): float
    {
        $items = $this->relationLoaded('items') ? $this->items : $this->items()->get();

        if ($items->isNotEmpty()) {
            return (float) $items->sum(fn (OrderItem $item) => $item->subtotal);
        }

        if ($this->order_type === 'custom' && $this->custom_price) {
            return (float) $this->custom_price * (int) ($this->custom_quantity ?? 1);
        }

        return (float) ($this->product?->price ?? 0) * (int) ($this->quantity ?? 1);
    }

    public function getIsCustomOrderAttribute(): bool
    {
        return $this->order_type === 'custom';
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

    /**
     * URL lengkap untuk bukti pengiriman.
     */
    public function getShippingProofUrlAttribute(): ?string
    {
        if (! $this->shipping_proof) {
            return null;
        }

        if (filter_var($this->shipping_proof, FILTER_VALIDATE_URL)) {
            return $this->shipping_proof;
        }

        return asset('storage/shipping_proofs/' . $this->shipping_proof);
    }

    /**
     * URL lengkap untuk bukti pelunasan ToP.
     */
    public function getSettlementProofUrlAttribute(): ?string
    {
        if (! $this->settlement_proof) {
            return null;
        }

        if (filter_var($this->settlement_proof, FILTER_VALIDATE_URL)) {
            return $this->settlement_proof;
        }

        return asset('storage/settlement_proofs/' . $this->settlement_proof);
    }

    /**
     * Label teks untuk status pelunasan ToP.
     */
    public function getSettlementLabelAttribute(): string
    {
        return match ($this->settlement_status) {
            'verified' => 'Pelunasan Terverifikasi',
            'pending'  => 'Menunggu Verifikasi Pelunasan',
            default    => 'Belum Ada Pelunasan',
        };
    }

    /**
     * Tanggal jatuh tempo ToP = tanggal barang dikirim (shipped_at) + tenure user
     * (default 30 hari). Fallback ke po_verified_at bila pengiriman belum tercatat.
     */
    public function getSettlementDueAtAttribute(): ?\Illuminate\Support\Carbon
    {
        $base = $this->shipped_at ?? $this->po_verified_at;
        if (! $base) {
            return null;
        }

        $tenureDays = (int) ($this->user?->top_tenure_days ?? \App\Models\User::TOP_DEFAULT_TENURE_DAYS);

        return $base->copy()->addDays((int) max($tenureDays, 1));
    }

    /**
     * Hitung status multi-tahap skema termin untuk frontend.
     * Mengembalikan array { stages[], overallStatus, totalAmount }.
     *
     * Setiap stage memiliki status: lunas | menunggu_verifikasi | belum_bayar.
     * Status diturunkan dari paid_bills + keberadaan proof_url pada bill.
     */
    public function getTerminStateAttribute(): ?array
    {
        if ($this->payment_method !== self::PAYMENT_TERMIN) {
            return null;
        }

        $bills = $this->termin_bills ?? [];
        $paidBills = $this->paid_bills ?? [];
        $totalAmount = 0;

        $stages = array_map(function ($bill) use ($paidBills, &$totalAmount) {
            $totalAmount += (float) ($bill['amount'] ?? 0);
            $isPaid = in_array($bill['key'], $paidBills, true);
            $hasProof = ! empty($bill['proof_url']);

            if ($isPaid) {
                $status = 'lunas';
            } elseif ($hasProof) {
                $status = 'menunggu_verifikasi';
            } else {
                $status = 'belum_bayar';
            }

            return [
                'key'         => $bill['key'],
                'label'       => collect(User::TERMIN_SCHEME)->firstWhere('key', $bill['key'])['label'] ?? $bill['label'],
                'percentage'  => $bill['percent'],
                'amount'      => $bill['amount'],
                'status'      => $status,
                'proof_url'   => $this->resolveProofUrl($bill['proof_url'] ?? null),
                'submitted_at'=> $bill['submitted_at'] ?? null,
                'metode'      => $bill['metode'] ?? null,
                'sender_name' => $bill['sender_name'] ?? null,
            ];
        }, $bills);

        $allPaid = count($bills) > 0 && collect($bills)->every(fn ($b) => in_array($b['key'], $paidBills, true));

        return [
            'stages'        => $stages,
            'overallStatus' => $allPaid ? 'lunas' : 'in_progress',
            'totalAmount'   => $totalAmount,
        ];
    }

    /**
     * Konversi proof_url: jika berupa filename saja, generate full URL.
     * Backward compatible untuk data lama yang sudah simpan full URL.
     */
    private function resolveProofUrl(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        // Jika sudah URL lengkap, kembalikan apa adanya
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // Jika hanya filename, generate URL
        return asset('storage/payment_proofs/' . $value);
    }

    public function trackStatus(string $status, ?string $label = null): void
    {
        $history = $this->status_history ?? [];
        $history[] = [
            'status'    => $status,
            'label'     => $label ?? $this->getStatusLabelAttribute(),
            'timestamp' => now()->toISOString(),
        ];
        $this->status_history = $history;
        $this->saveQuietly();
    }

    /**
     * Auto-generate order code sebelum disimpan.
     */
    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (! $order->order_code) {
                $order->order_code = 'MKN-' . strtoupper(Str::random(8));
            }
        });
    }
}