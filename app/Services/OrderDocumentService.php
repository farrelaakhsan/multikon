<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderDocument;
use App\Models\PaymentSetting;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OrderDocumentService
{
    public const TYPES = [
        'commercial_invoice',
        'faktur_pajak',
        'surat_jalan',
    ];

    protected const TYPE_INVOICE     = 'commercial_invoice';
    protected const TYPE_FAKTUR      = 'faktur_pajak';
    protected const TYPE_SURAT_JALAN = 'surat_jalan';

    public function issueForOrder(Order $order, string $type, bool $force = false): int
    {
        $count = 0;

        if ($type === self::TYPE_SURAT_JALAN) {
            if ($this->issueSuratJalan($order, $force)) {
                $count++;
            }

            return $count;
        }

        if ($type === self::TYPE_INVOICE || $type === self::TYPE_FAKTUR) {
            if ($order->payment_method === Order::PAYMENT_TERMIN) {
                foreach (($order->paid_bills ?? []) as $billKey) {
                    $issued = $type === self::TYPE_INVOICE
                        ? $this->issueCommercialInvoice($order, $billKey, $force)
                        : $this->issueFakturPajak($order, $billKey, $force);

                    if ($issued) {
                        $count++;
                    }
                }
            } else {
                $issued = $type === self::TYPE_INVOICE
                    ? $this->issueCommercialInvoice($order, null, $force)
                    : $this->issueFakturPajak($order, null, $force);

                if ($issued) {
                    $count++;
                }
            }
        }

        return $count;
    }

    public function issueCommercialInvoice(Order $order, ?string $billKey = null, bool $force = false): ?OrderDocument
    {
        if (! $force) {
            $existing = $this->findIssued($order, self::TYPE_INVOICE, $billKey);
            if ($existing) {
                return $existing;
            }
        }
        $this->forgetIssued($order, self::TYPE_INVOICE, $billKey);

        $data = $this->buildInvoiceData($order, $billKey);
        $number = $this->nextNumber(self::TYPE_INVOICE, 'INV/MKN');
        $fileName = 'commercial-invoice' . ($billKey ? '-' . $billKey : '') . '-' . $order->order_code . '.pdf';

        return $this->storeDocument(self::TYPE_INVOICE, $order, 'pdf.commercial-invoice', $data, $number, $fileName, $billKey);
    }

    public function issueFakturPajak(Order $order, ?string $billKey = null, bool $force = false): ?OrderDocument
    {
        $buyer = $this->buyerData($order->user);
        if (empty($buyer['npwp'])) {
            return null; // Faktur Pajak hanya untuk pembeli B2B ber-NPWP.
        }

        if (! $force) {
            $existing = $this->findIssued($order, self::TYPE_FAKTUR, $billKey);
            if ($existing) {
                return $existing;
            }
        }
        $this->forgetIssued($order, self::TYPE_FAKTUR, $billKey);

        $data = $this->buildFakturData($order, $billKey);
        $number = $this->nextFakturNumber();
        $fileName = 'faktur-pajak' . ($billKey ? '-' . $billKey : '') . '-' . $order->order_code . '.pdf';

        return $this->storeDocument(self::TYPE_FAKTUR, $order, 'pdf.faktur-pajak', $data, $number, $fileName, $billKey);
    }

    public function issueSuratJalan(Order $order, bool $force = false): ?OrderDocument
    {
        if (! $force) {
            $existing = $this->findIssued($order, self::TYPE_SURAT_JALAN, null);
            if ($existing) {
                return $existing;
            }
        }
        $this->forgetIssued($order, self::TYPE_SURAT_JALAN, null);

        $data = $this->buildSuratJalanData($order);
        $number = $this->nextNumber(self::TYPE_SURAT_JALAN, 'SJ/MKN');
        $fileName = 'surat-jalan-' . $order->order_code . '.pdf';

        return $this->storeDocument(self::TYPE_SURAT_JALAN, $order, 'pdf.surat-jalan', $data, $number, $fileName, null);
    }

    // ─── Kalkulasi pajak ────────────────────────────────────────────────────

    /**
     * DPP & PPN 11% dari total harga termasuk PPN (tax inclusive).
     * Mengoreksi pembulatan agar DPP + PPN selalu sama dengan total.
     */
    public static function computeTaxes(float $totalInclPpn): array
    {
        $total = round($totalInclPpn, 2);
        $dpp = round($total / 1.11, 2);
        $ppn = round($dpp * 0.11, 2);
        $ppn += round($total - ($dpp + $ppn), 2);

        return [
            'dpp'   => round($dpp, 2),
            'ppn'   => round($ppn, 2),
            'total' => $total,
        ];
    }

    // ─── Data builder ───────────────────────────────────────────────────────

    protected function buildInvoiceData(Order $order, ?string $billKey): array
    {
        $items = $this->orderItems($order);
        $shipping = (float) ($order->shipping_cost ?? 0);
        $subtotal = round(collect($items)->sum(fn ($i) => $i['subtotal']), 2);

        $terminBills = $order->termin_bills ?? [];
        $paidBills = $order->paid_bills ?? [];

        $bill = null;
        if ($billKey) {
            $bill = collect($terminBills)->first(fn ($b) => ($b['key'] ?? null) === $billKey);
        }

        // DPP & PPN hanya atas subtotal produk; ongkir di luar PPN (opsi b).
        $taxedTotal = $bill ? (float) ($bill['amount'] ?? $subtotal) : $subtotal;
        $tax = $this->computeTaxes($taxedTotal);

        return [
            'company'        => config('company'),
            'order_code'     => $order->order_code,
            'issue_date'     => $this->formatDate(now()),
            'buyer'          => $this->buyerData($order->user),
            'address'        => $order->address,
            'items'          => $items,
            'product_name'   => $items[0]['product_name'] ?? '-',
            'quantity'       => collect($items)->sum('quantity'),
            'unit_price'     => $items[0]['unit_price'] ?? 0,
            'subtotal'       => $subtotal,
            'shipping'       => $shipping,
            'is_bill'        => $bill !== null,
            'bill'           => $bill,
            'termin_bills'   => $terminBills,
            'paid_bills'     => $paidBills,
            'tax'            => $tax,
            'taxed_total'    => $taxedTotal,
            'grand_total'    => round($subtotal + $shipping, 2),
            'payment_label'  => $this->paymentLabel($order),
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'bank_accounts'  => $this->bankAccounts(),
        ];
    }

    private function buildFakturData(Order $order, ?string $billKey): array
    {
        $items = $this->orderItems($order);
        $subtotal = round(collect($items)->sum(fn ($i) => $i['subtotal']), 2);
        $shipping = (float) ($order->shipping_cost ?? 0);

        $bill = null;
        if ($billKey) {
            $bill = collect($order->termin_bills ?? [])->first(fn ($b) => ($b['key'] ?? null) === $billKey);
        }

        // DPP & PPN hanya atas subtotal produk; ongkir di luar PPN (opsi b).
        $taxedTotal = $bill ? (float) ($bill['amount'] ?? $subtotal) : $subtotal;
        $tax = $this->computeTaxes($taxedTotal);

        return [
            'company'       => config('company'),
            'order_code'    => $order->order_code,
            'issue_date'    => $this->formatDate(now()),
            'masa'          => $this->monthName(now()),
            'tahun'         => now()->format('Y'),
            'buyer'         => $this->buyerData($order->user),
            'address'       => $order->address,
            'items'         => $items,
            'product_name'  => $items[0]['product_name'] ?? '-',
            'quantity'      => collect($items)->sum('quantity'),
            'unit_dpp'      => round($tax['dpp'] / max(collect($items)->sum('quantity'), 1), 2),
            'dpp'           => $tax['dpp'],
            'ppn'           => $tax['ppn'],
            'total'         => $tax['total'],
            'is_bill'       => $bill !== null,
            'bill'          => $bill,
            'payment_method' => $order->payment_method,
        ];
    }

    private function buildSuratJalanData(Order $order): array
    {
        $isCargo = $order->shipping_method === 'cargo';

        return [
            'company'       => config('company'),
            'order_code'    => $order->order_code,
            'issue_date'    => $this->formatDate(now()),
            'buyer'         => $this->buyerData($order->user),
            'address'       => $order->address,
            'receiver_name' => $order->customer_name ?: null,
            'receiver_contact' => $order->whatsapp_number,
            'items'         => $this->orderItems($order),
            'product_name'  => $this->orderItems($order)[0]['product_name'] ?? '-',
            'quantity'      => collect($this->orderItems($order))->sum('quantity'),
            'shipping_method'=> $order->shipping_method,
            'is_cargo'      => $isCargo,
            'courier_name'  => $order->courier_name,
            'tracking_number' => $order->tracking_number,
            'driver_contact' => $order->driver_contact,
            'notes'         => $order->notes,
        ];
    }

    /**
     * Baris item untuk dokumen PDF (nama, qty, harga satuan, subtotal per line).
     */
    private function orderItems(Order $order): array
    {
        $rows = $order->items->isNotEmpty()
            ? $order->items
            : collect([(object) [
                'product_name' => $order->order_type === 'custom'
                    ? ($order->custom_requirements ?? 'Pesanan Custom')
                    : ($order->product?->name ?? '-'),
                'quantity'     => $order->order_type === 'custom'
                    ? (int) ($order->custom_quantity ?? 1)
                    : (int) ($order->quantity ?? 1),
                'unit_price'   => $order->order_type === 'custom'
                    ? (float) ($order->custom_price ?? 0)
                    : (float) ($order->product?->price ?? 0),
            ]]);

        return $rows->map(function ($item) {
            $unit = $item->line_type === 'custom'
                ? (float) ($item->custom_price ?? $item->unit_price ?? 0)
                : (float) ($item->unit_price ?? 0);
            $qty = (int) ($item->quantity ?? 1);

            return [
                'product_name' => $item->product_name ?? $item->product?->name ?? '-',
                'quantity'     => $qty,
                'unit_price'   => $unit,
                'subtotal'     => round($unit * $qty, 2),
            ];
        })->values()->toArray();
    }

    private function buyerData(?User $user): array
    {
        $name = $user?->name ?? '-';
        $companyName = null;
        $npwp = null;

        if ($user) {
            $application = $user->b2bApplications()->where('status', 'approved')->first();
            if ($application) {
                $companyName = $application->company_name;
                $npwp = $application->company_npwp;
            }
        }

        return [
            'name'         => $companyName ?: $name,
            'company'      => $companyName,
            'npwp'         => $npwp,
            'npwp_display' => $npwp ? $this->formatNpwp($npwp) : null,
        ];
    }

    private function bankAccounts(): array
    {
        return json_decode(PaymentSetting::getValue('bank_accounts') ?? '[]', true) ?? [];
    }

    private function paymentLabel(Order $order): string
    {
        return match ($order->payment_method) {
            Order::PAYMENT_TOP    => 'Tempo (ToP / Net 30)',
            Order::PAYMENT_TERMIN => 'Termin 40% - 40% - 20%',
            default               => $order->payment_status === 'paid' ? 'Lunas (Full Payment)' : 'Belum Lunas',
        };
    }

    // ─── Persistensi dokumen ────────────────────────────────────────────────

    private function storeDocument(string $type, Order $order, string $view, array $data, string $number, string $fileName, ?string $billKey): ?OrderDocument
    {
        $dir = 'documents/' . $order->order_code;
        $path = $dir . '/' . $fileName;

        try {
            $viewData = array_merge($data, ['document_number' => $number]);
            $pdf = Pdf::loadView($view, $viewData)->setPaper('a4');

            if (! Storage::disk('public')->exists($dir)) {
                Storage::disk('public')->makeDirectory($dir);
            }
            Storage::disk('public')->put($path, $pdf->output());
        } catch (\Throwable $e) {
            Log::error("[OrderDocument] Gagal membuat {$type} pesanan {$order->order_code}: " . $e->getMessage());

            return null;
        }

        return OrderDocument::create([
            'order_id'        => $order->id,
            'type'            => $type,
            'document_number' => $number,
            'file_path'       => $path,
            'issued_at'       => now(),
            'metadata'        => [
                'bill_key'   => $billKey,
                'order_code' => $order->order_code,
            ],
        ]);
    }

    private function findIssued(Order $order, string $type, ?string $billKey): ?OrderDocument
    {
        $query = OrderDocument::where('order_id', $order->id)->where('type', $type);
        if ($billKey !== null) {
            $query->whereJsonContains('metadata->bill_key', $billKey);
        }

        return $query->latest('issued_at')->first();
    }

    private function forgetIssued(Order $order, string $type, ?string $billKey): void
    {
        $query = OrderDocument::where('order_id', $order->id)->where('type', $type);
        if ($billKey !== null) {
            $query->whereJsonContains('metadata->bill_key', $billKey);
        }

        foreach ($query->get() as $doc) {
            if ($doc->file_path) {
                Storage::disk('public')->delete($doc->file_path);
            }
            $doc->delete();
        }
    }

    // ─── Nomor dokumen ──────────────────────────────────────────────────────

    private function nextNumber(string $type, string $prefix): string
    {
        $year = now()->format('Y');
        $count = OrderDocument::where('type', $type)->whereYear('issued_at', $year)->count();

        return $prefix . '/' . $year . '/' . str_pad((string) ($count + 1), 4, '0', STR_PAD_LEFT);
    }

    /**
     * Nomor seri Faktur Pajak format standar: 010.000-YY.{NPWP}-YYYY-{sekuens}.
     * Sufiks -sekuens menjamin keunikan antar faktur pada tahun yang sama
     * (padanan nomor urut faktur pada penatausahaan DJP).
     */
    private function nextFakturNumber(): string
    {
        $npwp = preg_replace('/\D/', '', (string) config('company.npwp', '')) ?: '000000000000000';
        $year = now()->format('Y');
        $seq = OrderDocument::where('type', self::TYPE_FAKTUR)->whereYear('issued_at', $year)->count() + 1;

        return '010.000-' . now()->format('y') . '.' . $npwp . '-' . $year . '-' . str_pad((string) $seq, 3, '0', STR_PAD_LEFT);
    }

    private function formatNpwp(string $npwp): string
    {
        $d = preg_replace('/\D/', '', $npwp);
        if (strlen($d) >= 15) {
            $extra = strlen($d) > 15 ? '.' . substr($d, 15, 3) : '';

            return substr($d, 0, 2) . '.' . substr($d, 2, 3) . '.' . substr($d, 5, 3) . '.' . substr($d, 8, 1)
                . '-' . substr($d, 9, 3) . '.' . substr($d, 12, 3) . $extra;
        }

        return $npwp;
    }

    private function monthName(\DateTimeInterface $date): string
    {
        $months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        return $months[(int) $date->format('n') - 1] ?? '';
    }

    private function formatDate(\DateTimeInterface $date): string
    {
        return (int) $date->format('d') . ' ' . $this->monthName($date) . ' ' . $date->format('Y');
    }

    public static function money(float $amount): string
    {
        return number_format($amount, 0, ',', '.');
    }
}