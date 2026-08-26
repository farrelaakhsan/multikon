<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_products'   => Product::count(),
                'total_orders'     => Order::count(),
                'pending_orders'   => Order::where('status', 'pending')->count(),
                'custom_orders'    => Order::where('status', 'custom_consultation')->count(),
                'revenue_estimate' => Order::with('items')->get()
                    ->sum(fn ($o) => $o->items->isNotEmpty()
                        ? $o->items->sum(fn ($i) => (float) $i->unit_price * (int) $i->quantity)
                        : 0),
            ],
            'recentOrders' => Order::with(['product', 'items.product'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($o) {
                    $isCustom = $o->order_type === 'custom';
                    $status = $o->status;
                    $hasProof = (bool) $o->payment_proof;
                    $isPaid = $o->payment_status === 'paid';

                    $progressSteps = $isCustom ? [
                        ['key' => 'created',      'label' => 'Pesanan Baru',    'done' => true],
                        ['key' => 'review',       'label' => 'Peninjauan',      'done' => $status !== 'waiting_review'],
                        ['key' => 'payment',      'label' => 'Pembayaran',      'done' => $hasProof],
                        ['key' => 'verification', 'label' => 'Verifikasi',      'done' => $isPaid],
                        ['key' => 'production',   'label' => 'Produksi',        'done' => in_array($status, ['shipped', 'done'])],
                        ['key' => 'shipping',     'label' => 'Pengiriman',      'done' => $status === 'done'],
                        ['key' => 'completed',    'label' => 'Selesai',         'done' => $status === 'done'],
                    ] : [
                        ['key' => 'created',    'label' => 'Dibuat',     'done' => true],
                        ['key' => 'proof',      'label' => 'Pembayaran', 'done' => $hasProof],
                        ['key' => 'verify',     'label' => 'Verifikasi', 'done' => $isPaid],
                        ['key' => 'process',    'label' => 'Diproses',   'done' => in_array($status, ['shipped', 'completed'])],
                        ['key' => 'shipping',   'label' => 'Dikirim',    'done' => $status === 'completed'],
                        ['key' => 'completed',  'label' => 'Selesai',    'done' => $status === 'completed'],
                    ];

                    $activeStep = null;
                    foreach ($progressSteps as $step) {
                        if (!$step['done']) {
                            $activeStep = $step;
                            break;
                        }
                    }

                    $firstItem = $o->items->first();

                    return [
                        'order_code'    => $o->order_code,
                        'customer_name' => $o->customer_name,
                        'product_name'  => $firstItem?->product_name ?? $o->product?->name ?? '-',
                        'status'        => $o->status,
                        'status_label'  => $activeStep ? 'Menunggu ' . $activeStep['label'] : 'Selesai',
                        'payment_label' => $o->payment_label,
                        'created_at'    => $o->created_at->format('d M Y, H:i'),
                    ];
                }),
        ]);
    }
}