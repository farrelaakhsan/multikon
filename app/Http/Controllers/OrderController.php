<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PaymentSetting;
use App\Models\Product;
use App\Services\OrderDocumentService;
use App\Services\OrderStatusFlowService;
use App\Services\RajaOngkirService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    public function __construct(private readonly OrderStatusFlowService $flowService)
    {
    }
    /**
     * Halaman pembayaran setelah order dibuat.
     */
    public function payment(string $orderCode): Response
    {
        $order = Order::where('order_code', $orderCode)
            ->with(['product', 'items.product'])
            ->firstOrFail();

        $items = $this->serializeItems($order);
        $shippingCost = $order->shipping_cost ?? 0;
        $subtotal = collect($items)->sum('subtotal');
        $totalPrice = $subtotal + $shippingCost;

        return Inertia::render('Orders/Payment', [
            'order'   => [
                'id'               => $order->id,
                'order_code'       => $order->order_code,
                'order_type'       => $order->order_type,
                'product_name'     => $items[0]['product_name'] ?? 'Pesanan Custom',
                'product_image'    => $items[0]['product_image'] ?? null,
                'product_price'    => $items[0]['unit_price'] ?? 0,
                'items'            => $items,
                'quantity'         => collect($items)->sum('quantity'),
                'subtotal'         => $subtotal,
                'shipping_cost'    => $shippingCost,
                'total_price'      => $totalPrice,
                'address'          => $order->address,
                'payment_method'   => $order->payment_method,
                'payment_label'    => $order->payment_label,
                'payment_status'   => $order->payment_status,
                'payment_proof'    => $order->payment_proof_url,
                'sender_bank_name' => $order->sender_bank_name,
                'transfer_date'    => $order->transfer_date?->format('Y-m-d'),
                'shipping_method'  => $order->shipping_method,
                'is_custom'        => $order->order_type === 'custom',
                'whatsapp_number'  => $order->whatsapp_number,
                'progress_steps'   => $this->flowService->buildSteps($order, 'user'),
                'payment_deadline'     => $order->payment_deadline?->toISOString(),
                'termin_bills'         => $order->termin_bills ?? [],
                'paid_bills'           => $order->paid_bills ?? [],
                'po_document_url'      => $order->po_document_url,
                'po_verification_status' => $order->po_verification_status,
                'po_document'          => $order->po_document,
            ],
        ]);
    }
    /**
     * Proses upload bukti pembayaran.
     */
    public function prosesPayment(Request $request, string $orderCode): \Illuminate\Http\RedirectResponse
    {
        $order = Order::where('order_code', $orderCode)->firstOrFail();

        $request->validate([
            'payment_proof'    => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'sender_bank_name' => ['required', 'string', 'max:255'],
            'transfer_date'    => ['required', 'date'],
        ]);

        $filename = $order->order_code . '_' . time() . '.' . $request->file('payment_proof')->extension();

        $request->file('payment_proof')->storeAs('payment_proofs', $filename, 'public');

        $newStatus = $order->order_type === 'ready_stock' ? 'waiting_confirmation' : $order->status;
        $order->update([
            'payment_proof'    => $filename,
            'sender_bank_name' => $request->input('sender_bank_name'),
            'transfer_date'    => $request->input('transfer_date'),
            'status'           => $newStatus,
            'has_unread_for_admin' => true,
        ]);

        if ($request->input('_redirect_to') === 'tracking') {
            return redirect()->route('order.tracking', $order->order_code);
        }

        return redirect()->route('order.payment', $order->order_code);
    }

    /**
     * Halaman pembayaran untuk custom order.
     */
    public function customPayment(string $orderCode): Response
    {
        $order = Order::where('order_code', $orderCode)
            ->with(['product', 'items.product'])
            ->firstOrFail();

        $items = $this->serializeItems($order);
        $shippingCost = $order->shipping_cost ?? 0;
        $subtotal = collect($items)->sum('subtotal');
        $totalPrice = $subtotal + $shippingCost;

        return Inertia::render('Orders/Payment', [
            'order'   => [
                'id'               => $order->id,
                'order_code'       => $order->order_code,
                'order_type'       => $order->order_type,
                'product_name'     => $items[0]['product_name'] ?? 'Pesanan Custom',
                'product_image'    => $items[0]['product_image'] ?? null,
                'product_price'    => $items[0]['unit_price'] ?? 0,
                'items'            => $items,
                'quantity'         => collect($items)->sum('quantity'),
                'subtotal'         => $subtotal,
                'shipping_cost'    => $shippingCost,
                'total_price'      => $totalPrice,
                'address'          => $order->address,
                'payment_method'   => $order->payment_method,
                'payment_label'    => $order->payment_label,
                'payment_status'   => $order->payment_status,
                'payment_proof'    => $order->payment_proof_url,
                'sender_bank_name' => $order->sender_bank_name,
                'transfer_date'    => $order->transfer_date?->format('Y-m-d'),
                'shipping_method'  => $order->shipping_method,
                'is_custom'        => $order->order_type === 'custom',
                'whatsapp_number'  => $order->whatsapp_number,
                'progress_steps'   => $this->flowService->buildSteps($order, 'user'),
                'termin_bills'         => $order->termin_bills ?? [],
                'paid_bills'           => $order->paid_bills ?? [],
                'po_document_url'      => $order->po_document_url,
                'po_verification_status' => $order->po_verification_status,
                'po_document'          => $order->po_document,
            ],
        ]);
    }

    /**
     * Proses upload bukti pembayaran untuk custom order.
     */
    public function prosesCustomPayment(Request $request, string $orderCode): \Illuminate\Http\RedirectResponse
    {
        $order = Order::where('order_code', $orderCode)->firstOrFail();

        $request->validate([
            'payment_proof'    => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'sender_bank_name' => ['required', 'string', 'max:255'],
            'transfer_date'    => ['required', 'date'],
        ]);

        $filename = $order->order_code . '_' . time() . '.' . $request->file('payment_proof')->extension();

        $request->file('payment_proof')->storeAs('payment_proofs', $filename, 'public');

        $order->update([
            'payment_proof'    => $filename,
            'sender_bank_name' => $request->input('sender_bank_name'),
            'transfer_date'    => $request->input('transfer_date'),
            'status'           => 'waiting_confirmation',
            'has_unread_for_admin' => true,
        ]);

        return redirect()->route('order.payment', $order->order_code);
    }

    /**
     * Halaman tracking pesanan.
     */
    public function tracking(Request $request, string $orderCode): Response
    {
        $order = Order::where('order_code', $orderCode)
            ->with(['product', 'items.product'])
            ->firstOrFail();

        $progressSteps = $this->flowService->buildSteps($order, 'user');

        $items = $this->serializeItems($order);
        $shippingCost = $order->shipping_cost ?? 0;
        $subtotal = collect($items)->sum('subtotal');
        $totalPrice = $subtotal + $shippingCost;

        if ($order->has_unread_for_user) {
            $order->update(['has_unread_for_user' => false]);
        }

        $bankData = null;
        if (str_starts_with($order->payment_method, 'bank_')) {
            $index = (int) str_replace('bank_', '', $order->payment_method);
            $accounts = json_decode(PaymentSetting::getValue('bank_accounts') ?? '[]', true) ?? [];
            $bankData = $accounts[$index] ?? null;
        }

        return Inertia::render('Orders/Detail', [
            'order'    => [
                'id'               => $order->id,
                'order_code'       => $order->order_code,
                'customer_name'    => $order->customer_name,
                'product_name'     => $items[0]['product_name'] ?? 'Pesanan Custom',
                'product_image'    => $items[0]['product_image'] ?? null,
                'product_price'    => $items[0]['unit_price'] ?? 0,
                'items'            => $items,
                'quantity'         => collect($items)->sum('quantity'),
                'subtotal'         => $subtotal,
                'shipping_cost'    => $shippingCost,
                'total_price'      => $totalPrice,
                'status'           => $order->status,
                'status_label'     => $order->status_label,
                'payment_status'   => $order->payment_status,
                'payment_method'   => $order->payment_method,
                'payment_proof'    => $order->payment_proof_url,
                'is_custom'       => $order->order_type === 'custom',
                'payment_label'    => $order->payment_label,
                'po_document_url'         => $order->po_document_url,
                'po_verification_status'  => $order->po_verification_status,
                'po_verification_label'   => $order->po_verification_label,
                'termin_bills'            => $order->termin_bills ?? [],
                'paid_bills'              => $order->paid_bills ?? [],
                'termin'                  => $order->termin_state,
                'settlement_status'       => $order->settlement_status,
                'settlement_label'        => $order->settlement_label,
                'settlement_proof'        => $order->settlement_proof_url,
                'settlement_due_at'       => $order->settlement_due_at?->format('d M Y'),
                'payment_deadline'        => $order->payment_deadline?->toISOString(),
                'payment_deadline_formatted' => $order->payment_deadline
                    ? $order->payment_deadline->locale('id')->isoFormat('DD MMMM YYYY, HH:mm') . ' WIB'
                    : null,
                'bank_name'               => $bankData['bank'] ?? null,
                'bank_code'               => strtoupper($bankData['bank'] ?? ''),
                'bank_account_number'     => $bankData['account'] ?? null,
                'bank_account_name'       => $bankData['name'] ?? null,
                'custom_requirements' => $order->custom_requirements,
                'custom_specifications' => $order->custom_specifications,
                'courier_name'       => $order->courier_name,
                'tracking_number'    => $order->tracking_number,
                'driver_contact'     => $order->driver_contact,
                'shipping_proof'     => $order->shipping_proof_url,
                'shipping_method'    => $order->shipping_method,
                'payment_label'      => $order->payment_label,
                'address'            => $order->address,
                'notes'              => $order->notes,
                'custom_notes'       => $order->custom_notes,
                'whatsapp_number'    => $order->whatsapp_number,
                'reference_file_url' => $order->reference_file_url,
                'progress_steps'     => $progressSteps,
                'estimated_weight'   => $order->estimated_weight,
                'subdistrict_id'     => $order->subdistrict_id,
                'subdistrict_name'   => $order->subdistrict_name,
                'district_name'      => $order->district_name,
                'city_name'          => $order->city_name,
                'can_download'       => $this->userCanDownload($request, $order),
                'documents'          => $this->serializeDocuments($order),
                'sender_bank_name'   => $order->sender_bank_name,
                'transfer_date'      => $order->transfer_date?->format('d M Y'),
                'payment_proof_filename' => $order->payment_proof,
            ],
        ]);
    }

    /**
     * Unduh dokumen PDF terbitan (Commercial Invoice / Faktur Pajak / Surat Jalan).
     * Hanya pemilik order atau admin, serta dokumen yang sudah terbit.
     */
    public function downloadDocument(Request $request, Order $order, string $document): StreamedResponse
    {
        abort_unless($this->userCanDownload($request, $order), 403);
        abort_unless(in_array($document, OrderDocumentService::TYPES, true), 404);

        $doc = $order->documents()->where('type', $document)->latest('issued_at')->first();
        abort_unless($doc, 404);

        return \Illuminate\Support\Facades\Storage::disk('public')
            ->download($doc->file_path, $doc->download_name);
    }

    /**
     * Apakah user saat ini boleh mengunduh dokumen pesanan.
     */
    private function userCanDownload(Request $request, Order $order): bool
    {
        $user = $request->user();

        if (! $user) {
            return false;
        }

        return (bool) $user->is_admin || $order->user_id === $user->id;
    }

    /**
     * Serialisasi dokumen PDF untuk halaman rincian (buyer).
     */
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

    /**
     * Unduh contoh template Purchase Order (PO) dalam format PDF.
     */
    public function poTemplate(): \Illuminate\Http\Response
    {
        $pdf = Pdf::loadView('pdf.po-template');

        return $pdf->download('contoh-purchase-order-multikon.pdf');
    }

    /**
     * Tampilkan form pesanan custom.
     */
    public function createCustom(Request $request): Response
    {
        $user = $request->user();
        $productId = $request->query('product_id');
        $product = $productId ? Product::find($productId) : null;
        $addresses = $user?->addresses()->latest()->get();

        return Inertia::render('Orders/CustomCreate', [
            'product'          => $product ? $this->formatProduct($product) : null,
            'user'             => $user ? ['name' => $user->name] : null,
            'addresses'        => $addresses,
            'is_b2b_verified'  => $user?->is_b2b_verified ?? false,
            'termin_scheme'    => $user?->termin_scheme ?? [],
        ]);
    }

    /**
     * Simpan pesanan custom.
     */
    public function storeCustom(Request $request)
    {
        $validated = $request->validate([
            'whatsapp_number'     => ['nullable', 'string', 'max:20'],
            'product_name'        => ['nullable', 'string', 'max:255'],
            'requirements'        => ['required', 'string', 'max:5000'],
            'specifications'      => ['nullable', 'string', 'max:5000'],
            'quantity'            => ['required', 'integer', 'min:1'],
            'shipping_method'     => ['required', 'string', 'in:cargo,pickup'],
            'estimated_weight'    => ['nullable', 'numeric', 'min:0'],
            'notes'               => ['nullable', 'string', 'max:1000'],
            'selected_address_id' => ['required', 'exists:addresses,id'],
            'product_id'          => ['nullable', 'exists:products,id'],
            'reference_file'      => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf,webp', 'max:5120'],
            'payment_method'      => ['nullable', 'string', 'in:instant,' . Order::PAYMENT_TERMIN],
        ]);

        $user = $request->user();
        $address = \App\Models\Address::findOrFail($validated['selected_address_id']);

        $paymentMethod = $this->defaultPaymentMethod();
        if (($validated['payment_method'] ?? null) === Order::PAYMENT_TERMIN) {
            if (! $user->is_b2b_verified) {
                return back()->withErrors(['payment_method' => 'Pembayaran Termin hanya tersedia untuk akun bisnis yang sudah terverifikasi.']);
            }
            $paymentMethod = Order::PAYMENT_TERMIN;
        }

        $referenceFilePath = null;
        if ($request->hasFile('reference_file')) {
            $filename = 'ref_' . time() . '_' . uniqid() . '.' . $request->file('reference_file')->extension();
            $request->file('reference_file')->storeAs('reference_files', $filename, 'public');
            $referenceFilePath = $filename;
        }

        $order = Order::create([
            'order_type'            => 'custom',
            'user_id'               => $user->id,
            'product_id'            => $validated['product_id'],
            'customer_name'         => $user->name,
            'whatsapp_number'       => $validated['whatsapp_number'],
            'address'               => $address->address,
            'shipping_method'       => $validated['shipping_method'],
            'estimated_weight'      => $validated['shipping_method'] === 'cargo' ? ($validated['estimated_weight'] ?? null) : null,
            'subdistrict_id'        => $address->subdistrict_id,
            'subdistrict_name'      => $address->subdistrict_name,
            'district_name'         => $address->district_name,
            'city_name'             => $address->city_name,
            'custom_requirements'   => $validated['product_name'],
            'custom_specifications' => $validated['specifications'] ?? null,
            'custom_quantity'       => $validated['quantity'],
            'custom_notes'          => $validated['notes'] ?? null,
            'reference_file'        => $referenceFilePath,
            'status'                => 'waiting_review',
            'has_unread_for_admin'  => true,
            'payment_status'        => 'pending',
            'payment_method'        => $paymentMethod,
            'payment_deadline'      => $paymentMethod === Order::PAYMENT_TERMIN ? null : now()->addHours(24),
        ]);

        $order->items()->create([
            'product_id'            => $validated['product_id'],
            'line_type'             => 'custom',
            'product_name'          => $validated['product_name'] ?? 'Pesanan Custom',
            'quantity'              => $validated['quantity'],
            'unit_price'            => 0,
            'custom_price'          => null,
            'custom_requirements'   => $validated['product_name'],
            'custom_specifications' => $validated['specifications'] ?? null,
            'custom_notes'          => $validated['notes'] ?? null,
            'reference_file'        => $referenceFilePath,
        ]);

        return redirect()->route('order.tracking', $order->order_code);
    }

    /**
     * Hitung ongkos kirim untuk pesanan tertentu via RajaOngkir.
     */
    public function calculateShipping(Request $request, Order $order, RajaOngkirService $rajaOngkir): JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($order->shipping_method !== 'cargo') {
            return response()->json(['error' => 'Pengiriman bukan cargo.'], 422);
        }

        $weight = (float) ($order->estimated_weight ?? 0);
        if ($weight <= 0) {
            return response()->json(['error' => 'Berat estimasi belum diisi.'], 422);
        }

        $subdistrictId = $order->subdistrict_id;
        if (!$subdistrictId) {
            return response()->json(['error' => 'Alamat tujuan tidak memiliki data kecamatan.'], 422);
        }

        $weightInGrams = (int) ceil($weight * 1000);
        $costs = $rajaOngkir->getCost((int) $subdistrictId, $weightInGrams);

        if ($costs === null) {
            return response()->json(['error' => 'Gagal menghitung ongkos kirim. Coba lagi.'], 502);
        }

        if (empty($costs)) {
            return response()->json(['couriers' => [], 'weight' => $weight, 'destination' => ''], 200);
        }

        $flat = [];
        foreach ($costs as $item) {
            $code = $item['code'] ?? '';
            if (!$code) continue;
            $cost = (int) ($item['cost'] ?? 0);
            $flat[] = [
                'name'           => $item['name'] ?? $code,
                'service'        => $item['service'] ?? '',
                'cost'           => $cost,
                'etd'            => $item['etd'] ?? '',
                'cost_formatted' => 'Rp ' . number_format($cost, 0, ',', '.'),
            ];
        }

        return response()->json([
            'weight'       => $weight,
            'destination'  => implode(', ', array_filter([$order->subdistrict_name, $order->district_name, $order->city_name])),
            'couriers'     => $flat,
        ]);
    }

    /**
     * Simpan pilihan kurir & ongkos kirim oleh user.
     */
    public function selectShipping(Request $request, Order $order): RedirectResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'courier_name'    => ['required', 'string', 'max:255'],
            'courier_service' => ['required', 'string', 'max:255'],
            'shipping_cost'   => ['required', 'numeric', 'min:0'],
        ]);

        $order->update([
            'courier_name'  => $validated['courier_name'] . ' - ' . $validated['courier_service'],
            'shipping_cost' => $validated['shipping_cost'],
        ]);

        return back()->with('success', 'Kurir pengiriman berhasil dipilih.');
    }

    private function defaultPaymentMethod(): string
    {
        return 'pending';
    }

    /**
     * Halaman daftar pesanan pelanggan (Pesanan Saya).
     */
    public function myOrders(Request $request): Response
    {
        $filter = $request->query('filter', 'all');
        $statusGroups = [
            'all'       => [],
            'pending'   => ['pending_payment', 'po_verification', 'waiting_payment'],
            'processed' => ['waiting_confirmation', 'waiting_review', 'confirmed', 'processing', 'in_progress', 'in_production', 'custom_consultation'],
            'shipped'   => ['shipped'],
            'completed' => ['completed', 'done'],
        ];

        $query = $request->user()->orders()->with(['product', 'items.product'])->latest('id');

        if ($filter !== 'all' && isset($statusGroups[$filter])) {
            $query->whereIn('status', $statusGroups[$filter]);
        }

        $orders = $query->paginate(10)->withQueryString()->through(function ($order) {
            $items = $this->serializeItems($order);
            $first = $items[0] ?? null;
            $shippingCost = $order->shipping_cost ?? 0;
            $subtotal = collect($items)->sum('subtotal');

            return [
                'id'              => $order->id,
                'order_code'      => $order->order_code,
                'product_name'    => $first['product_name'] ?? 'Pesanan Custom',
                'product_image'   => $first['product_image'] ?? null,
                'items'           => $items,
                'item_count'      => count($items),
                'status'          => $order->status,
                'status_label'    => $order->status_label,
                'payment_status'  => $order->payment_status,
                'payment_method'  => $order->payment_method,
                'payment_label'   => $order->payment_label,
                'is_custom'      => $order->order_type === 'custom',
                'quantity'        => collect($items)->sum('quantity'),
                'unit_price'      => $first['unit_price'] ?? 0,
                'subtotal'        => $subtotal,
                'shipping_cost'   => $shippingCost,
                'total_price'     => $subtotal + $shippingCost,
                'has_unread_for_user' => $order->has_unread_for_user,
                'created_at'      => $order->created_at->format('d M Y, H:i'),
                'created_raw'     => $order->created_at->toISOString(),
            ];
        });

        return Inertia::render('Orders/MyOrders', [
            'orders'       => $orders,
            'activeFilter' => $filter,
        ]);
    }

    /**
     * Update payment method for an unpaid order.
     */
    public function updatePaymentMethod(Request $request, Order $order): RedirectResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($order->payment_status !== 'pending') {
            return back()->with('error', 'Tidak dapat mengubah metode pembayaran setelah pembayaran dikonfirmasi.');
        }

        $validMethods = PaymentSetting::validPaymentMethods();

        $validated = $request->validate([
            'payment_method' => ['required', 'string', 'in:' . implode(',', $validMethods)],
        ]);

        $order->update(['payment_method' => $validated['payment_method']]);

        return back()->with('success', 'Metode pembayaran berhasil diubah.');
    }

    /**
     * Auto-save address to user's saved addresses if not already saved.
     */
    private function autoSaveAddress(\App\Models\User $user, string $address, ?string $label = null, ?array $location = null): void
    {
        $exists = $user->addresses()
            ->where('address', $address)
            ->exists();

        if (! $exists) {
            $hasAddresses = $user->addresses()->exists();
            $data = [
                'label'      => $label ?: 'Rumah',
                'address'    => $address,
                'is_default' => ! $hasAddresses,
            ];

            if ($location) {
                $data['subdistrict_id']   = $location['subdistrict_id'] ?? null;
                $data['subdistrict_name'] = $location['subdistrict_name'] ?? null;
                $data['district_name']    = $location['district_name'] ?? null;
                $data['city_name']        = $location['city_name'] ?? null;
            }

            $user->addresses()->create($data);
        }
    }

    /**
     * Konfirmasi pesanan diterima oleh pembeli (shipped â†’ completed/done).
     * Untuk ToP: masuk ke tahap Menunggu Pelunasan (H+30).
     */
    public function confirmReceived(Order $order): RedirectResponse
    {
        if ($order->status !== 'shipped') {
            abort(403, 'Status pesanan tidak valid.');
        }

        if ($order->payment_method === Order::PAYMENT_TOP) {
            $order->update([
                'status'              => Order::STATUS_WAITING_SETTLEMENT,
                'has_unread_for_admin' => true,
            ]);
            $order->trackStatus(Order::STATUS_WAITING_SETTLEMENT, 'Menunggu Pelunasan (H+30)');

            return redirect()->route('order.tracking', $order->order_code)
                ->with('success', 'Pesanan diterima. Tagihan tempo (H+30) sedang berjalan.');
        }

        $order->update([
            'status'              => $order->order_type === 'custom' ? 'done' : 'completed',
            'has_unread_for_admin' => true,
        ]);

        return redirect()->route('order.tracking', $order->order_code)
            ->with('success', 'Pesanan telah dikonfirmasi selesai.');
    }

    /**
     * Unggah bukti pelunasan untuk pesanan ToP (tahap H+30).
     */
    public function uploadSettlement(Request $request, Order $order): RedirectResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($order->payment_method !== Order::PAYMENT_TOP) {
            abort(403, 'Pelunasan hanya berlaku untuk pesanan Tempo (ToP).');
        }

        if ($order->settlement_status === 'verified') {
            return back()->with('error', 'Pelunasan pesanan ini sudah terverifikasi.');
        }

        $request->validate([
            'settlement_proof'  => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'sender_bank_name'  => ['required', 'string', 'max:255'],
            'transfer_date'     => ['required', 'date'],
        ]);

        $filename = $order->order_code . '_settlement_' . time() . '.' . $request->file('settlement_proof')->extension();
        $request->file('settlement_proof')->storeAs('settlement_proofs', $filename, 'public');

        $order->update([
            'settlement_proof'   => $filename,
            'settlement_status'  => 'pending',
            'sender_bank_name'   => $request->input('sender_bank_name'),
            'transfer_date'      => $request->input('transfer_date'),
            'has_unread_for_admin' => true,
        ]);
        $order->trackStatus('settlement_uploaded', 'Bukti Pelunasan Diunggah');

        return back()->with('success', 'Bukti pelunasan berhasil diunggah. Menunggu verifikasi admin.');
    }

    /**
     * Unggah bukti pembayaran tagihan termin (DP / Progress / Final).
     * Menyimpan data bukti per-bill di dalam JSON termin_bills.
     */
    public function uploadTerminBill(Request $request, Order $order): RedirectResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($order->payment_method !== Order::PAYMENT_TERMIN) {
            abort(403, 'Pembayaran termin hanya berlaku untuk pesanan termin.');
        }

        $request->validate([
            'payment_proof'    => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'metode'           => ['required', 'string', 'in:transfer_bank,qris'],
            'sender_bank_name' => ['required_if:metode,transfer_bank', 'nullable', 'string', 'max:255'],
            'transfer_date'    => ['required', 'date'],
        ]);

        $bills = $order->termin_bills ?? [];
        $paidBills = $order->paid_bills ?? [];

        // Cari index tagihan aktif (belum lunas pertama)
        $activeIndex = null;
        foreach ($bills as $i => $bill) {
            if (! in_array($bill['key'], $paidBills, true)) {
                $activeIndex = $i;
                break;
            }
        }

        if ($activeIndex === null) {
            return back()->with('error', 'Semua tagihan sudah lunas.');
        }

        $billKey = $bills[$activeIndex]['key'];
        $billLabel = $bills[$activeIndex]['label'];

        // Simpan file bukti
        $filename = $order->order_code . '_termin_' . $billKey . '_' . time() . '.' . $request->file('payment_proof')->extension();
        $request->file('payment_proof')->storeAs('payment_proofs', $filename, 'public');

        // Update data bukti per-bill di dalam JSON termin_bills
        $bills[$activeIndex]['proof_url'] = $filename;
        $bills[$activeIndex]['submitted_at'] = now()->toIso8601String();
        $bills[$activeIndex]['metode'] = $request->input('metode');
        $bills[$activeIndex]['sender_name'] = $request->input('sender_bank_name');

        $order->update([
            'termin_bills' => $bills,
            'has_unread_for_admin' => true,
        ]);
        $order->trackStatus('termin_proof_uploaded', 'Bukti Pembayaran ' . $billLabel . ' Diunggah');

        return back()->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.');
    }

    /**
     * Format data produk untuk dikirim ke frontend.
     * Selalu gunakan image_url (bukan image mentah).
     */
    private function formatProduct(Product $p): array
    {
        return [
            'id'                => $p->id,
            'name'              => $p->name,
            'category'          => $p->category,
            'description'       => $p->description,
            'image'             => $p->image,
            'image_url'         => $p->image_url,
            'price'             => $p->price,
            'specifications'    => $p->specifications,
            'is_customizable'   => $p->is_customizable,
            'stock'             => $p->stock,
            'warranty'          => $p->warranty,
            'usage_instructions'=> $p->usage_instructions,
        ];
    }

    /**
     * Serialisasi line item pesanan untuk dikirim ke frontend.
     * Fallback: bila order_items kosong (order lama), buat satu baris
     * dari kolom legacy orders (product_id / quantity / custom_*).
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
                'reference_file_url'    => $this->itemReferenceUrl($item),
                'dpp'                   => $item->dpp ?? null,
                'ppn'                   => $item->ppn ?? null,
            ];
        })->values()->toArray();
    }

    /**
     * URL file referensi suatu line item (tanpa akses accessor Eloquent).
     */
    private function itemReferenceUrl(mixed $item): ?string
    {
        $file = $item->reference_file ?? null;
        if (! $file) {
            return null;
        }

        if (filter_var($file, FILTER_VALIDATE_URL)) {
            return $file;
        }

        return asset('storage/reference_files/' . $file);
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
            'reference_file'        => $isCustom ? $order->reference_file : null,
            'dpp'                   => null,
            'ppn'                   => null,
        ];
    }
}