<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\PaymentSetting;
use App\Models\Product;
use App\Services\RajaOngkirService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $items = $user
            ->cartItems()
            ->with('product')
            ->latest()
            ->get()
            ->map(fn (CartItem $item) => $this->formatItem($item));

        $total = $items->sum('subtotal');

        $addresses = $user->addresses()->latest()->get();

        return Inertia::render('Cart/Index', [
            'items'     => $items,
            'total'     => $total,
            'addresses' => $addresses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $user = $request->user();

        $existing = $user->cartItems()
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            $existing->increment('quantity', $validated['quantity']);
        } else {
            $user->cartItems()->create([
                'product_id' => $validated['product_id'],
                'quantity'   => $validated['quantity'],
            ]);
        }

        return redirect()->back()->with('success', 'Produk ditambahkan ke keranjang.');
    }

    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->authorizeOwner($request, $cartItem);

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem->update(['quantity' => $validated['quantity']]);

        return redirect()->back()->with('success', 'Jumlah produk diperbarui.');
    }

    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        $this->authorizeOwner($request, $cartItem);

        $cartItem->delete();

        return redirect()->back()->with('success', 'Produk dihapus dari keranjang.');
    }

    public function checkoutPage(Request $request): Response
    {
        $user = $request->user();

        $productId = $request->query('product_id');
        $directBuy = false;

        if ($productId) {
            // Direct buy: checkout langsung tanpa menambah ke keranjang.
            $product = Product::findOrFail((int) $productId);
            $quantity = max((int) ($request->query('quantity', 1)), 1);
            $items = collect([$this->formatDirectItem($product, $quantity)]);
            $directBuy = true;
        } else {
            $itemIds = $request->query('items');
            $itemIds = $itemIds ? explode(',', $itemIds) : [];

            $items = $user
                ->cartItems()
                ->with('product')
                ->whereIn('id', $itemIds)
                ->latest()
                ->get()
                ->map(fn (CartItem $item) => $this->formatItem($item));
        }

        $total = $items->sum('subtotal');

        $addresses = $user->addresses()->latest()->get();

        return Inertia::render('Cart/Checkout', [
            'items'             => $items,
            'total'             => $total,
            'addresses'         => $addresses,
            'direct_buy'        => $directBuy,
            'is_b2b_verified'   => $user->is_b2b_verified,
            'credit_limit'      => $user->credit_limit,
            'remaining_credit'  => $user->remaining_credit,
            'top_tenure_days'   => $user->top_tenure_days,
            'top_disabled'      => $user->top_disabled,
        ]);
    }

    public function checkout(Request $request): RedirectResponse
    {
        $paymentMethods = explode(',', $this->validPaymentMethods());
        $paymentMethods[] = Order::PAYMENT_TOP;

        $validated = $request->validate([
            'cart_items'          => ['required_without:product_id', 'array', 'min:1'],
            'cart_items.*'        => ['required', 'integer', 'exists:cart_items,id'],
            'product_id'          => ['required_without:cart_items', 'integer', 'exists:products,id'],
            'quantity'            => ['required_without:cart_items', 'integer', 'min:1'],
            'whatsapp_number'     => ['nullable', 'string', 'max:20'],
            'selected_address_id' => ['required', 'integer', 'exists:addresses,id'],
            'shipping_type'       => ['nullable', 'string', 'in:cargo,pickup'],
            'notes'               => ['nullable', 'string', 'max:1000'],
            'payment_method'      => ['required', 'string', 'in:' . implode(',', $paymentMethods)],
            'shipping_cost'       => ['nullable', 'numeric', 'min:0'],
            'courier_name'        => ['nullable', 'string', 'max:100'],
            'courier_service'     => ['nullable', 'string', 'max:100'],
            'subdistrict_id'      => ['nullable', 'string', 'max:50'],
            'subdistrict_name'    => ['nullable', 'string', 'max:255'],
            'district_name'       => ['nullable', 'string', 'max:255'],
            'city_name'           => ['nullable', 'string', 'max:255'],
            'po_document'         => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ]);

        $user = $request->user();

        $address = \App\Models\Address::findOrFail($validated['selected_address_id']);

        if ($address->user_id !== $user->id) {
            abort(403);
        }

        // Direct buy: user memilih "Beli" di katalog/detail produk, true
        // checkout langsung tanpa menambah ke keranjang.
        if ($validated['product_id'] ?? false) {
            $product = Product::findOrFail($validated['product_id']);
            $quantity = max((int) ($validated['quantity'] ?? 1), 1);

            $items = collect([(object) [
                'product'  => $product,
                'quantity' => $quantity,
            ]]);

            $fromCart = false;
        } else {
            $items = $user->cartItems()
                ->with('product')
                ->whereIn('id', $validated['cart_items'])
                ->get();

            if ($items->isEmpty()) {
                return redirect()->back()->with('error', 'Tidak ada item yang dipilih.');
            }

            $fromCart = true;
        }

        $isTop = ($validated['payment_method'] ?? null) === Order::PAYMENT_TOP;
        if ($isTop) {
            $this->validateToPAllowed($user, $items, $validated);
        }

        $shippingType = $validated['shipping_type'] ?? 'pickup';
        $shippingMethod = $shippingType;
        $shippingCost = $validated['shipping_cost'] ?? null;
        $courierName = $validated['courier_name'] ?? null;
        $courierService = $validated['courier_service'] ?? null;

        $poPath = null;
        if ($isTop && $request->hasFile('po_document')) {
            $poPath = $request->file('po_document')->store('po_documents', 'public');
        }

        // Validasi stok untuk produk ready stock SEBELUM transaksi dimulai.
        foreach ($items as $item) {
            $product = $item->product ?? $item->product ?? null;
            if (! $product || $product->is_customizable) {
                continue;
            }
            $qty = $item->quantity;
            if ((int) $product->stock < $qty) {
                return redirect()->back()->with('error', "Stok \"{$product->name}\" tidak mencukupi. Tersisa {$product->stock} unit.");
            }
        }

        $createdOrders = DB::transaction(function () use (
            $items, $validated, $user, $address, $isTop, $poPath,
            $shippingMethod, $shippingCost, $courierName, $courierService, $fromCart
        ) {
            // Kelompokkan item keranjang per kategori: Ready Stock vs Custom.
            // Item dengan kategori yang sama menjadi SATU pesanan.
            $readyItems = $items->filter(fn ($item) => ! (bool) ($item->product?->is_customizable ?? false))->values();
            $customItems = $items->filter(fn ($item) => (bool) ($item->product?->is_customizable ?? false))->values();

            $groups = [];
            if ($readyItems->isNotEmpty()) {
                $groups[] = [
                    'order_type' => 'ready_stock',
                    'status'     => $isTop ? Order::STATUS_PO_VERIFICATION : 'pending_payment',
                    'items'      => $readyItems,
                ];
            }
            if ($customItems->isNotEmpty()) {
                $groups[] = [
                    'order_type' => 'custom',
                    'status'     => 'custom_consultation',
                    'items'      => $customItems,
                ];
            }

            $createdOrders = [];
            $totalCreditUsed = 0;

            foreach ($groups as $group) {
                $groupItems = $group['items'];
                $groupSubtotal = 0;
                foreach ($groupItems as $cartItem) {
                    $groupSubtotal += ($cartItem->product?->price ?? 0) * $cartItem->quantity;
                }
                $orderTotal = $groupSubtotal + ($shippingMethod === 'cargo' ? (float) ($shippingCost ?? 0) : 0);

                $order = Order::create([
                    'order_type'          => $group['order_type'],
                    'user_id'             => $user->id,
                    'customer_name'       => $user->name,
                    'whatsapp_number'     => $validated['whatsapp_number'],
                    'address'             => $address->address,
                    'shipping_method'     => $shippingMethod,
                    'shipping_cost'       => $shippingCost,
                    'courier_name'        => $courierService ? $courierName . ' - ' . $courierService : $courierName,
                    'notes'               => $validated['notes'] ?? null,
                    'payment_method'      => $validated['payment_method'],
                    'payment_status'      => 'pending',
                    'status'              => $group['status'],
                    'po_document'         => $isTop ? $poPath : null,
                    'po_verification_status' => $isTop ? 'pending' : null,
                    'credit_used'         => $isTop ? $orderTotal : null,
                    'subdistrict_id'      => $validated['subdistrict_id'] ?? null,
                    'subdistrict_name'    => $validated['subdistrict_name'] ?? null,
                    'district_name'       => $validated['district_name'] ?? null,
                    'city_name'           => $validated['city_name'] ?? null,
                    'payment_deadline'    => $isTop ? null : now()->addHours(24),
                ]);

                foreach ($groupItems as $cartItem) {
                    $product = $cartItem->product;
                    if (! $product) continue;

                    $subtotal = ($product->price ?? 0) * $cartItem->quantity;
                    $order->items()->create([
                        'product_id'   => $product->id,
                        'line_type'    => $group['order_type'] === 'custom' ? 'custom' : 'ready_stock',
                        'product_name' => $product->name,
                        'quantity'     => $cartItem->quantity,
                        'unit_price'   => $product->price ?? 0,
                        'dpp'          => round($subtotal / 1.11, 2),
                        'ppn'          => round(($subtotal / 1.11) * 0.11, 2),
                    ]);

                    // Kurangi stok untuk produk ready stock.
                    if ($group['order_type'] === 'ready_stock') {
                        $product->decrementStock($cartItem->quantity);
                    }
                }

                $createdOrders[] = $order;
                $totalCreditUsed += $isTop ? $orderTotal : 0;

                if ($fromCart) {
                    $groupItemIds = $groupItems->pluck('id')->all();
                    $user->cartItems()->whereIn('id', $groupItemIds)->delete();
                }
            }

            if ($isTop && $totalCreditUsed > 0) {
                $user->decrement('remaining_credit', $totalCreditUsed);
            }

            return $createdOrders;
        });

        if (empty($createdOrders)) {
            return redirect()->back()->with('error', 'Gagal membuat pesanan.');
        }

        $redirectRoute = $isTop ? 'order.tracking' : 'order.payment';
        $codes = collect($createdOrders)->map(fn ($o) => $o->order_code)->all();

        return redirect()->route($redirectRoute, $codes[0])
            ->with('success', count($createdOrders) . ' pesanan berhasil dibuat: ' . implode(', ', $codes));
    }

    /**
     * Validasi khusus Pembayaran Tempo (ToP): user B2B, produk ready stock,
     * dokumen PO wajib, dan sisa limit kredit mencukupi.
     */
    private function validateToPAllowed(
        \App\Models\User $user,
        \Illuminate\Support\Collection $items,
        array $validated
    ): void {
        if (! $user->is_b2b_verified) {
            throw ValidationException::withMessages([
                'payment_method' => 'Pembayaran Tempo (ToP) hanya tersedia untuk akun bisnis yang sudah terverifikasi.',
            ]);
        }

        if ($user->top_disabled) {
            throw ValidationException::withMessages([
                'payment_method' => 'Fasilitas Pembayaran Tempo (ToP) sedang dibekukan admin. Silakan gunakan metode pembayaran lain atau hubungi admin.',
            ]);
        }

        $hasCustomItem = $items->contains(fn ($item) => (bool) ($item->product?->is_customizable ?? false));
        if ($hasCustomItem) {
            throw ValidationException::withMessages([
                'payment_method' => 'Pembayaran Tempo (ToP) hanya berlaku untuk produk Ready Stock.',
            ]);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($validated, [
            'po_document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ], [
            'po_document.required' => 'Dokumen Purchase Order (PO) wajib dilampirkan. Silakan unggah dokumen PO resmi perusahaan Anda dalam format PDF atau Gambar (maksimal 5MB).',
            'po_document.mimes'    => 'Dokumen Purchase Order (PO) wajib dilampirkan dalam format PDF atau Gambar (JPG/JPEG/PNG), maksimal 5MB.',
            'po_document.max'      => 'Dokumen Purchase Order (PO) tidak boleh melebihi ukuran 5MB.',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $grandTotal = 0;
        foreach ($items as $item) {
            $grandTotal += ($item->product?->price ?? 0) * $item->quantity;
        }
        if (($validated['shipping_type'] ?? 'pickup') === 'cargo') {
            $grandTotal += (float) ($validated['shipping_cost'] ?? 0);
        }

        $remainingCredit = (float) ($user->remaining_credit ?? 0);
        if ($grandTotal > $remainingCredit) {
            throw ValidationException::withMessages([
                'credit_limit' => 'Sisa limit kredit tidak mencukupi. Total transaksi ini melebihi batas Credit Limit Anda. Silakan lunasi tagihan berjalan Anda terlebih dahulu atau gunakan metode pembayaran lain.',
            ]);
        }
    }

    public function searchDestination(Request $request, RajaOngkirService $rajaOngkir): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'max:255'],
        ]);

        $results = $rajaOngkir->searchDestination($validated['q']);

        return response()->json(['results' => $results]);
    }

    public function getProvinces(Request $request, RajaOngkirService $rajaOngkir): JsonResponse
    {
        return response()->json(['provinces' => $rajaOngkir->getProvinces()]);
    }

    public function getCities(Request $request, RajaOngkirService $rajaOngkir, int $provinceId): JsonResponse
    {
        return response()->json(['cities' => $rajaOngkir->getCities($provinceId)]);
    }

    public function getDistricts(Request $request, RajaOngkirService $rajaOngkir, int $cityId): JsonResponse
    {
        return response()->json(['districts' => $rajaOngkir->getDistricts($cityId)]);
    }

    public function shippingCost(Request $request, RajaOngkirService $rajaOngkir): JsonResponse
    {
        $validated = $request->validate([
            'product_ids'                  => ['required', 'array', 'min:1'],
            'product_ids.*'                => ['required', 'integer', 'exists:products,id'],
            'destination_subdistrict_id'   => ['required', 'integer'],
            'quantities'                   => ['nullable', 'array'],
            'quantities.*'                 => ['nullable', 'integer', 'min:1'],
        ]);

        $products = Product::whereIn('id', $validated['product_ids'])->get();
        $quantities = $validated['quantities'] ?? [];

        $totalWeight = 0;
        foreach ($products as $product) {
            $qty = (int) ($quantities[$product->id] ?? 1);
            $weight = (float) ($product->weight ?? 0);
            $totalWeight += $weight * $qty;
        }

        if ($totalWeight <= 0) {
            return response()->json(['error' => 'Berat produk tidak tersedia.'], 400);
        }

        $weightInGrams = (int) ceil($totalWeight * 1000);
        $costs = $rajaOngkir->getCost($validated['destination_subdistrict_id'], $weightInGrams);

        if (empty($costs)) {
            return response()->json(['error' => 'Tidak ada kurir tersedia untuk rute ini.'], 404);
        }

        // Group flat API items by courier code into {name, code, costs[]} format
        $grouped = [];
        foreach ($costs as $item) {
            $code = $item['code'] ?? '';
            if (!$code) continue;
            if (!isset($grouped[$code])) {
                $grouped[$code] = [
                    'name'  => $item['name'] ?? $code,
                    'code'  => $code,
                    'costs' => [],
                ];
            }
            $grouped[$code]['costs'][] = [
                'service'     => $item['service'] ?? '',
                'description' => $item['description'] ?? '',
                'cost'        => [
                    ['value' => $item['cost'] ?? 0, 'etd' => $item['etd'] ?? ''],
                ],
            ];
        }

        return response()->json([
            'weight'    => $totalWeight,
            'origin'    => 'Jatinegara Kaum, Pulo Gadung, Jakarta Timur',
            'costs'     => array_values($grouped),
        ]);
    }

    private function validPaymentMethods(): string
    {
        $settings = PaymentSetting::allAsArray();
        $accounts = json_decode($settings['bank_accounts'] ?? '[]', true) ?? [];
        $methods = ['qris'];
        foreach ($accounts as $i => $acc) {
            $methods[] = 'bank_' . $i;
        }
        return implode(',', $methods);
    }

    private function authorizeOwner(Request $request, CartItem $cartItem): void
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403);
        }
    }

    private function formatItem(CartItem $item): array
    {
        $product = $item->product;
        $price = $product?->price ?? 0;

        return [
            'id'            => $item->id,
            'product_id'    => $item->product_id,
            'quantity'      => $item->quantity,
            'product_name'  => $product?->name ?? 'Produk tidak ditemukan',
            'product_image' => $product?->image_url ?? null,
            'category'      => $product?->category ?? '',
            'price'         => $price,
            'weight'        => $product?->weight ?? 0,
            'subtotal'      => $price * $item->quantity,
            'is_customizable' => $product?->is_customizable ?? false,
            'stock'         => $product?->stock ?? 0,
        ];
    }

    /**
     * Ringkasan item untuk alur direct buy (tombol "Beli").
     * Mengembalikan bentuk yang sama dengan formatItem().
     */
    private function formatDirectItem(Product $product, int $quantity): array
    {
        $price = $product->price ?? 0;

        return [
            'id'              => 'direct-' . $product->id,
            'product_id'      => $product->id,
            'quantity'        => $quantity,
            'product_name'    => $product->name,
            'product_image'   => $product->image_url ?? null,
            'category'        => $product->category ?? '',
            'price'           => $price,
            'weight'          => $product->weight ?? 0,
            'subtotal'        => $price * $quantity,
            'is_customizable' => $product->is_customizable ?? false,
            'stock'           => $product->stock ?? 0,
        ];
    }
}
