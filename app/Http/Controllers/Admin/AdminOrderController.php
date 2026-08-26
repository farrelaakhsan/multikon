<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderDocumentService;
use App\Services\OrderStatusFlowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminOrderController extends Controller
{
    public function __construct(
        private readonly OrderDocumentService $documentService,
        private readonly OrderStatusFlowService $statusFlowService,
    ) {
    }
    // Semua status yang ada di sistem
    const STATUS_OPTIONS_READY_STOCK = [
        'pending_payment',
        'po_verification',
        'waiting_confirmation',
        'processing',
        'shipped',
        'waiting_settlement',
        'completed',
        'cancelled',
    ];

    const STATUS_OPTIONS_CUSTOM = [
        'waiting_review',
        'waiting_payment',
        'in_production',
        'shipped',
        'waiting_settlement',
        'done',
        'cancelled',
    ];

    const STATUS_OPTIONS = [
        // Ready Stock
        'pending_payment',
        'po_verification',
        'waiting_confirmation',
        'processing',
        'shipped',
        'waiting_settlement',
        'completed',
        'cancelled',
        // Custom
        'custom_consultation',
        'confirmed',
        'in_progress',
        'done',
        // Custom Order Flow
        'waiting_review',
        'waiting_payment',
        'in_production',
    ];

    public function index(): Response
    {
        $filter = request()->string('filter')->toString() ?: 'all';
        $search = request()->string('search')->toString() ?: '';

        $query = Order::with(['product', 'items.product'])->latest();

        if ($filter === 'ready_stock') {
            $query->where('order_type', 'ready_stock');
        } elseif ($filter === 'custom') {
            $query->where('order_type', 'custom');
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_code', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('whatsapp_number', 'like', "%{$search}%");
            });
        }

        $allQuery = Order::query();

        $orders = $query
            ->paginate(20)
            ->through(fn ($o) => [
                'id'                 => $o->id,
                'order_code'         => $o->order_code,
                'order_type'         => $o->order_type ?? 'ready_stock',
                'customer_name'      => $o->customer_name,
                'whatsapp_number'    => $o->whatsapp_number,
                'items'              => $this->serializeItems($o),
                'product_name'       => $this->primaryItemName($o),
                'product_image'      => $this->primaryItemImage($o),
                'item_count'         => max(count($o->items), 1),
                'quantity'           => $o->items->isNotEmpty() ? $o->items->sum('quantity') : ($o->quantity ?? 1),
                'is_custom'          => $o->order_type === 'custom',
                'custom_price'       => $o->custom_price,
                'status'             => $o->status,
                'status_label'       => $o->status_label,
                'payment_method'     => $o->payment_method,
                'payment_status'     => $o->payment_status,
                'payment_label'      => $o->payment_label,
                'total_price'          => $o->total_price,
                'has_unread_for_admin' => $o->has_unread_for_admin,
                'progress_steps'       => $this->statusFlowService->buildSteps($o, 'admin'),
                'created_at'           => $o->created_at->format('d M Y, H:i'),
            ])
            ->withQueryString();

        $stats = [
            'total'   => $allQuery->count(),
            'waiting' => $allQuery->whereIn('status', ['pending_payment', 'po_verification', 'waiting_confirmation', 'waiting_review', 'waiting_payment'])->count(),
            'active'  => $allQuery->whereIn('status', ['processing', 'in_production', 'shipped', 'waiting_settlement'])->count(),
            'done'    => $allQuery->whereIn('status', ['completed', 'done'])->count(),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders'        => $orders,
            'activeFilter'  => $filter,
            'search'        => $search,
            'stats'         => $stats,
        ]);
    }

    public function updateStatus(Order $order): RedirectResponse
    {
        request()->validate([
            'status' => ['required', 'string', 'in:' . implode(',', self::STATUS_OPTIONS)],
        ]);

        $newStatus = request('status');

        $this->restoreCreditIfCancelled($order, $newStatus);
        $this->restoreStockForCancelled($order, $newStatus);

        if ($order->payment_method === Order::PAYMENT_TOP
            && in_array($newStatus, ['completed', 'done'], true)
            && ! $order->credit_restored_at
            && (float) ($order->credit_used ?? 0) > 0
        ) {
            $order->load('user');
            $this->restoreCreditIfSettled($order);
        }

        $order->update([
            'status' => $newStatus,
            'shipped_at' => $newStatus === 'shipped' ? ($order->shipped_at ?? now()) : $order->shipped_at,
            'has_unread_for_user' => true,
            'credit_restored_at' => $order->credit_restored_at,
        ]);
        $order->trackStatus($newStatus);

        $order->load('product');

        return back()->with('success', 'Status pesanan diperbarui.');
    }

    /**
     * Detail pesanan untuk admin.
     */
    public function show(Order $order): Response
    {
        $order->load(['product', 'user', 'items.product']);

        $isCustom = $order->order_type === 'custom';
        $items = $this->serializeItems($order);
        $shippingCost = $order->shipping_cost ?? 0;
        $subtotal = collect($items)->sum('subtotal');
        $totalPrice = $subtotal + $shippingCost;

        $progressSteps = $this->statusFlowService->buildSteps($order, 'admin');

        // Backfill status_history untuk order lama
        $history = $order->status_history ?? [];
        if (empty($history)) {
            $history[] = [
                'status'    => 'created',
                'label'     => 'Pesanan Dibuat',
                'timestamp' => $order->created_at->toISOString(),
            ];
            $order->status_history = $history;
            $order->saveQuietly();
        }

        // Build activities untuk frontend (timeline)
        $activities = collect($history)->map(fn ($h) => [
            'status'    => $h['status'],
            'label'     => $h['label'],
            'timestamp' => $h['timestamp'],
        ])->values()->toArray();

        $hasShippingInfo = $order->courier_name || $order->tracking_number || $order->driver_contact || $order->shipping_proof;

        if ($order->has_unread_for_admin) {
            $order->update(['has_unread_for_admin' => false]);
        }

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id'                    => $order->id,
                'order_code'            => $order->order_code,
                'order_type'            => $order->order_type ?? 'ready_stock',
                'customer_name'         => $order->customer_name,
                'whatsapp_number'       => $order->whatsapp_number,
                'address'               => $order->address,
                'notes'                 => $order->notes,
                'product_name'          => $items[0]['product_name'] ?? '-',
                'product_image'         => $items[0]['product_image'] ?? null,
                'product_price'         => $items[0]['unit_price'] ?? 0,
                'items'                 => $items,
                'quantity'              => collect($items)->sum('quantity'),
                'subtotal'              => $subtotal,
                'shipping_cost'         => $shippingCost,
                'total_price'           => $totalPrice,
                'is_custom'             => $isCustom,
                'custom_requirements'   => $order->custom_requirements,
                'custom_specifications' => $order->custom_specifications,
                'custom_notes'          => $order->custom_notes,
                'reference_file_url'    => $order->reference_file_url,
                'payment_method'        => $order->payment_method,
                'payment_label'         => $order->payment_label,
                'payment_status'        => $order->payment_status,
                'payment_proof'         => $order->payment_proof_url,
                'sender_bank_name'      => $order->sender_bank_name,
                'transfer_date'         => $order->transfer_date?->format('Y-m-d'),
                'po_document_url'         => $order->po_document_url,
                'po_verification_status'  => $order->po_verification_status,
                'po_verification_label'   => $order->po_verification_label,
                'credit_used'             => $order->credit_used,
                'termin_bills'            => $order->termin_bills ?? [],
                'paid_bills'              => $order->paid_bills ?? [],
                'termin'                  => $order->termin_state,
                'settlement_status'       => $order->settlement_status,
                'settlement_label'        => $order->settlement_label,
                'settlement_proof'        => $order->settlement_proof_url,
                'settlement_due_at'       => $order->settlement_due_at?->format('d M Y, H:i'),
                'status'                => $order->status,
                'status_label'          => $order->status_label,
                'courier_name'          => $order->courier_name,
                'tracking_number'       => $order->tracking_number,
                'driver_contact'        => $order->driver_contact,
                'shipping_proof'        => $order->shipping_proof_url,
                'shipping_method'       => $order->shipping_method,
                'created_at'            => $order->created_at->format('d M Y, H:i'),
                'created_at_raw'        => $order->created_at->toISOString(),
                'updated_at'            => $order->updated_at->format('d M Y, H:i'),
                'activities'            => $activities,
                'progress_steps'        => $progressSteps,
                'documents'             => $this->serializeDocuments($order),
                'user_b2b_approved'     => $order->user?->b2b_status === 'approved',
            ],
            'statusOptions'         => $isCustom ? self::STATUS_OPTIONS_CUSTOM : self::STATUS_OPTIONS_READY_STOCK,
            'statusOptionsAll'      => self::STATUS_OPTIONS,
        ]);
    }

    /**
     * Konfirmasi pembayaran pesanan.
     * - ToP: verifikasi PO (lihat verifyPo).
     * - Termin: tandai tagihan berjalan (milestone) terbayar.
     * - Lainnya: pelunasan penuh.
     */
    public function confirmPayment(Order $order): RedirectResponse
    {
        if ($order->payment_method === Order::PAYMENT_TOP) {
            return $this->verifyPo($order);
        }

        $isCustom = $order->order_type === 'custom';
        $isTermin = $order->payment_method === Order::PAYMENT_TERMIN;
        $newStatus = $isCustom ? 'in_production' : 'processing';

        if ($isTermin) {
            $bills = $order->termin_bills ?? [];
            $paidBills = $order->paid_bills ?? [];
            $nextKey = collect($bills)->first(fn ($b) => ! in_array($b['key'], $paidBills, true));

            if ($nextKey && empty($nextKey['proof_url'])) {
                return back()->with('error', 'Belum ada bukti pembayaran untuk tagihan ini.');
            }

            if ($nextKey) {
                $paidBills[] = $nextKey['key'];
            }
            $allBillsPaid = collect($bills)->every(fn ($b) => in_array($b['key'], $paidBills, true));

            // Rule Fase 3: begitu tagihan pertama (DP) dikonfirmasi lunas,
            // status langsung maju ke Diproduksi — jangan ditahan di verifikasi.
            $order->update([
                'paid_bills'      => $paidBills,
                'payment_status'  => $allBillsPaid ? 'paid' : 'partial',
                'status'          => in_array($order->status, ['waiting_payment', 'waiting_confirmation'], true) ? 'in_production' : $order->status,
                'has_unread_for_user' => true,
            ]);
            $order->trackStatus('payment_confirmed', 'Tagihan Termin Dikonfirmasi: ' . ($nextKey['label'] ?? $nextKey['key'] ?? '-'));

            if (in_array($order->status, ['waiting_payment', 'waiting_confirmation'], true)) {
                $order->trackStatus('in_production');
            }

            $this->issuePaymentDocuments($order);

            return back()->with('success', 'Tagihan termin berhasil dikonfirmasi.');
        }

        $order->update([
            'payment_status'     => 'paid',
            'status'             => $newStatus,
            'has_unread_for_user' => true,
        ]);
        $order->trackStatus('payment_confirmed', 'Pembayaran Dikonfirmasi');
        $order->trackStatus($newStatus);

        $order->load('product');
        $this->issuePaymentDocuments($order);

        return back()->with('success', 'Pembayaran pesanan telah dikonfirmasi.');
    }

    /**
     * Verifikasi dokumen Purchase Order untuk pesanan Tempo (ToP).
     */
    public function verifyPo(Order $order): RedirectResponse
    {
        if ($order->po_verification_status === 'verified') {
            return back()->with('error', 'Purchase Order pesanan ini sudah diverifikasi.');
        }

        $order->update([
            'payment_method'        => Order::PAYMENT_TOP,
            'po_verification_status'=> 'verified',
            'po_verified_at'        => now(),
            'status'                => 'processing',
            'has_unread_for_user'   => true,
        ]);
        $order->trackStatus('po_verified', 'Purchase Order Diverifikasi');
        $order->trackStatus('processing');

        $order->load('product');
        $this->issuePaymentDocuments($order);

        return back()->with('success', 'Purchase Order diverifikasi. Pesanan siap diproses.');
    }

    /**
     * Konfirmasi pelunasan ToP (tahap H+30).
     * - Menandai settlement terverifikasi + status completed.
     * - Mengembalikan limit kredit yang terpotong saat pesanan dibuat.
     */
    public function confirmSettlement(Order $order): RedirectResponse
    {
        if ($order->payment_method !== Order::PAYMENT_TOP) {
            return back()->with('error', 'Pelunasan hanya untuk pesanan Tempo (ToP).');
        }

        if ($order->settlement_status === 'verified') {
            return back()->with('error', 'Pelunasan pesanan ini sudah terverifikasi.');
        }

        $order->load('user');
        $this->restoreCreditIfSettled($order);

        $order->update([
            'settlement_status'       => 'verified',
            'settlement_verified_at'  => now(),
            'status'                  => 'completed',
            'payment_status'          => 'paid',
            'has_unread_for_user'     => true,
            'credit_restored_at'      => $order->freshTimestamp(),
        ]);
        $order->trackStatus('settlement_verified', 'Pelunasan ToP Diverifikasi');
        $order->trackStatus('completed');

        return back()->with('success', 'Pelunasan ToP diverifikasi. Pesanan selesai dan limit kredit dikembalikan.');
    }

    /**
     * Kembalikan sisa limit kredit saat pelunasan ToP terverifikasi.
     * Guard anti double-restore: credit_restored_at.
     */
    private function restoreCreditIfSettled(Order $order): void
    {
        $creditUsed = (float) ($order->credit_used ?? 0);
        if ($creditUsed <= 0) {
            Log::info("[CreditRestore] Skip restore — order {$order->order_code}: credit_used={$creditUsed}");
            return;
        }

        if ($order->credit_restored_at) {
            Log::info("[CreditRestore] Skip restore — order {$order->order_code}: credit_restored_at already set");
            return;
        }

        if (! $order->relationLoaded('user')) {
            $order->load('user');
        }

        $user = $order->user;
        if (! $user) {
            Log::warning("[CreditRestore] FAIL — order {$order->order_code}: user not found (user_id={$order->user_id})");
            return;
        }

        $user->increment('remaining_credit', $creditUsed);
        $order->forceFill(['credit_restored_at' => now()])->save();

        Log::info("[CreditRestore] SUCCESS — order {$order->order_code}: restored Rp" . number_format($creditUsed, 0, ',', '.') . " to user {$user->id} (remaining_credit={$user->fresh()->remaining_credit})");
    }

    /**
     * Set harga untuk pesanan custom.
     */
    public function setCustomPrice(Order $order): RedirectResponse
    {
        $rules = [
            'custom_price' => ['required', 'numeric', 'min:0'],
        ];

        if ($order->shipping_method === 'cargo' && $order->order_type === 'custom') {
            $rules['estimated_weight'] = ['required', 'numeric', 'min:0.1'];
        }

        $data = request()->validate($rules);

        $isTermin = $order->payment_method === Order::PAYMENT_TERMIN;
        $quantity = $order->custom_quantity ?? ($order->items->first()?->quantity ?? 1);
        $shipping = (float) ($order->shipping_cost ?? 0);
        $totalDeal = ((float) $data['custom_price']) * $quantity + $shipping;

        $data['status'] = 'waiting_payment';
        $data['has_unread_for_user'] = true;

        // Sinkronkan harga ke line item pesanan (order_items).
        foreach ($order->items as $item) {
            $itemSubtotal = ((float) $data['custom_price']) * (int) ($item->quantity ?? 1);
            $item->update([
                'custom_price' => $data['custom_price'],
                'unit_price'   => $data['custom_price'],
                'dpp'          => round($itemSubtotal / 1.11, 2),
                'ppn'          => round(($itemSubtotal / 1.11) * 0.11, 2),
            ]);
        }

        if ($isTermin) {
            $bills = [];
            foreach (\App\Models\User::TERMIN_SCHEME as $phase) {
                $bills[] = [
                    'key'     => $phase['key'],
                    'label'   => $phase['label'],
                    'percent' => $phase['percent'],
                    'amount'  => round($totalDeal * ($phase['percent'] / 100)),
                ];
            }
            $data['termin_bills'] = $bills;
        }

        $order->update($data);
        $order->trackStatus('price_set', 'Harga Ditentukan Rp ' . number_format((int) $data['custom_price'], 0, ',', '.'));
        $order->trackStatus('waiting_payment');

        if ($isTermin) {
            $order->trackStatus('termin_dp', 'DP 40% siap dibayar: Rp ' . number_format((int) ($order->termin_bills[0]['amount'] ?? 0), 0, ',', '.'));
        }

        return back()->with('success', 'Harga pesanan custom telah ditentukan.');
    }

    /**
     * Simpan data pengiriman pesanan.
     */
    public function storeShipping(Request $request, Order $order): RedirectResponse
    {
        $isCargo = $order->shipping_method === 'cargo';

        $validated = $request->validate([
            'courier_name'    => [$isCargo ? 'required' : 'nullable', 'string', 'max:255'],
            'tracking_number' => [$isCargo ? 'required' : 'nullable', 'string', 'max:255'],
            'driver_contact'  => [$isCargo ? 'required' : 'nullable', 'string', 'max:20'],
            'shipping_proof'  => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $filename = null;
        if ($request->hasFile('shipping_proof')) {
            $filename = 'shipping_' . $order->order_code . '_' . time() . '.' . $request->file('shipping_proof')->extension();
            $request->file('shipping_proof')->storeAs('shipping_proofs', $filename, 'public');
        }

        $updateData = [
            'courier_name'       => $validated['courier_name'] ?? null,
            'tracking_number'    => $validated['tracking_number'] ?? null,
            'driver_contact'     => $validated['driver_contact'] ?? null,
            'status'             => 'shipped',
            'shipped_at'         => now(),
            'has_unread_for_user' => true,
        ];

        if ($filename) {
            $updateData['shipping_proof'] = $filename;
        }

        $order->update($updateData);
        $order->trackStatus('shipping_data', $isCargo
            ? 'Data Pengiriman: ' . $validated['courier_name'] . ' - ' . $validated['tracking_number']
            : 'Pesanan siap diambil di workshop');
        $order->trackStatus('shipped');

        $order->load('product');

        try {
            $this->documentService->issueForOrder($order, 'surat_jalan');
        } catch (\Throwable $e) {
            Log::error('[OrderDocument] Gagal terbit Surat Jalan ' . $order->order_code . ': ' . $e->getMessage());
        }

        return back()->with('success', 'Data pengiriman berhasil disimpan dan status diperbarui menjadi Dikirim.');
    }

    /**
     * Tolak pembayaran pesanan.
     */
    public function rejectPayment(Order $order): RedirectResponse
    {
        $order->update([
            'payment_status'     => 'failed',
            'status'             => 'cancelled',
            'has_unread_for_user' => true,
        ]);
        $order->trackStatus('payment_rejected', 'Pembayaran Ditolak');
        $order->trackStatus('cancelled');

        $this->restoreCreditIfCancelled($order, 'cancelled');
        $this->restoreStockForCancelled($order, 'cancelled');

        $order->load('product');

        return back()->with('success', 'Pembayaran pesanan telah ditolak.');
    }

    /**
     * Kembalikan sisa limit kredit yang terpotong saat pesanan ToP dibuat,
     * apabila pesanan dibatalkan dan kreditnya belum pernah dikembalikan.
     */
    private function restoreCreditIfCancelled(Order $order, string $newStatus): void
    {
        if ($newStatus !== 'cancelled') {
            return;
        }

        $creditUsed = (float) ($order->credit_used ?? 0);
        if ($creditUsed <= 0 || $order->credit_restored_at) {
            return;
        }

        if (! $order->relationLoaded('user')) {
            $order->load('user');
        }

        $user = $order->user;
        if ($user) {
            $user->increment('remaining_credit', $creditUsed);
        }

        $order->forceFill(['credit_restored_at' => now()])->save();
    }

    /**
     * Kembalikan stok produk ready stock saat pesanan dibatalkan.
     */
    private function restoreStockForCancelled(Order $order, string $newStatus): void
    {
        if ($newStatus !== 'cancelled') {
            return;
        }

        if ($order->order_type !== 'ready_stock') {
            return;
        }

        if (! $order->relationLoaded('items')) {
            $order->load('items.product');
        }

        foreach ($order->items as $item) {
            $product = $item->product;
            if (! $product || $product->is_customizable) {
                continue;
            }
            $product->restoreStock($item->quantity);
        }
    }

    /**
     * Terbitkan dokumen pembayaran (Commercial Invoice + Faktur Pajak) otomatis.
     */
    private function issuePaymentDocuments(Order $order): void
    {
        try {
            $this->documentService->issueForOrder($order, 'commercial_invoice');
            $this->documentService->issueForOrder($order, 'faktur_pajak');
        } catch (\Throwable $e) {
            Log::error('[OrderDocument] Gagal menerbitkan dokumen pembayaran pesanan ' . $order->order_code . ': ' . $e->getMessage());
        }
    }

    /**
     * Terbitkan / lengkapi dokumen PDF pesanan secara manual.
     */
    public function issueDocument(Request $request, Order $order, string $document): RedirectResponse
    {
        abort_unless(in_array($document, OrderDocumentService::TYPES, true), 404);

        $count = $this->documentService->issueForOrder($order, $document);

        return back()->with('success', "Dokumen PDF berhasil diterbitkan ({$count}).");
    }

    /**
     * Unduh dokumen PDF terbitan pesanan.
     */
    public function downloadDocument(Request $request, Order $order, string $document): StreamedResponse
    {
        abort_unless(in_array($document, OrderDocumentService::TYPES, true), 404);

        $doc = $order->documents()->where('type', $document)->latest('issued_at')->first();
        abort_unless($doc, 404);

        return Storage::disk('public')->download($doc->file_path, $doc->download_name);
    }

    /**
     * Nama produk utama (line pertama) untuk daftar pesanan.
     */
    private function primaryItemName(Order $order): string
    {
        if ($order->items->isNotEmpty()) {
            return $order->items->first()->product_name
                ?? $order->items->first()->product?->name
                ?? 'Pesanan Custom';
        }

        return $order->order_type === 'custom'
            ? ($order->custom_requirements ?? 'Pesanan Custom')
            : ($order->product?->name ?? '-');
    }

    /**
     * Gambar produk utama (line pertama) untuk daftar pesanan.
     */
    private function primaryItemImage(Order $order): ?string
    {
        if ($order->items->isNotEmpty()) {
            return $order->items->first()->product?->image_url ?? null;
        }

        return $order->product?->image_url ?? null;
    }

    /**
     * Serialisasi line item pesanan untuk frontend.
     */
    private function serializeItems(Order $order): array
    {
        $items = $order->items->isNotEmpty()
            ? $order->items
            : collect([$this->legacyItemFallback($order)]);

        return $items->map(function ($item) {
            $price = $item->line_type === 'custom'
                ? (float) ($item->custom_price ?? $item->unit_price ?? 0)
                : (float) ($item->unit_price ?? 0);
            $qty = (int) ($item->quantity ?? 1);

            return [
                'id'                    => $item->id ?? null,
                'product_id'            => $item->product_id ?? null,
                'line_type'             => $item->line_type ?? 'ready_stock',
                'is_custom'             => ($item->line_type ?? 'ready_stock') === 'custom',
                'product_name'          => $item->product_name ?? ($item->product?->name ?? 'Produk'),
                'product_image'         => $item->product?->image_url ?? null,
                'quantity'              => $qty,
                'unit_price'            => $price,
                'subtotal'              => $price * $qty,
                'custom_price'          => $item->custom_price ?? null,
                'custom_requirements'   => $item->custom_requirements,
                'custom_specifications' => $item->custom_specifications,
                'custom_notes'          => $item->custom_notes,
                'dpp'                   => $item->dpp ?? null,
                'ppn'                   => $item->ppn ?? null,
            ];
        })->values()->toArray();
    }

    /**
     * Baris item sintetis dari kolom legacy untuk pesanan lama.
     */
    private function legacyItemFallback(Order $order): object
    {
        $isCustom = $order->order_type === 'custom';
        $product = $order->product;

        return (object) [
            'id'                    => null,
            'product_id'            => $order->product_id,
            'line_type'             => $isCustom ? 'custom' : 'ready_stock',
            'product_name'          => $isCustom ? ($order->custom_requirements ?? 'Pesanan Custom') : ($product?->name ?? '-'),
            'product'               => $product,
            'quantity'              => $isCustom ? ($order->custom_quantity ?? 1) : ($order->quantity ?? 1),
            'unit_price'            => $isCustom ? ($order->custom_price ?? 0) : ($product?->price ?? 0),
            'custom_price'          => $isCustom ? $order->custom_price : null,
            'custom_requirements'   => $isCustom ? $order->custom_requirements : null,
            'custom_specifications' => $isCustom ? $order->custom_specifications : null,
            'custom_notes'          => $isCustom ? $order->custom_notes : null,
            'dpp'                   => null,
            'ppn'                   => null,
        ];
    }

    private function serializeDocuments(Order $order): array
    {
        return $order->documents()->get()->map(fn ($doc) => [
            'type'            => $doc->type,
            'document_number' => $doc->document_number,
            'url'             => $doc->file_url,
            'download_name'   => $doc->download_name,
            'issued_at'       => $doc->issued_at?->format('d M Y, H:i'),
        ])->values()->toArray();
    }
}