<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Tabel item pesanan (multi-produk per order).
 * Setiap baris = satu produk (atau satu spesifikasi custom) dalam satu pesanan.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->nullOnDelete();
            $table->string('line_type')->default('ready_stock'); // ready_stock | custom
            $table->string('product_name')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('custom_price', 15, 2)->nullable();
            $table->text('custom_requirements')->nullable();
            $table->text('custom_specifications')->nullable();
            $table->text('custom_notes')->nullable();
            $table->string('reference_file')->nullable();
            $table->decimal('dpp', 15, 2)->nullable();
            $table->decimal('ppn', 15, 2)->nullable();
            $table->timestamps();
        });

        $this->backfillFromOrders();
    }

    /**
     * Backfill: pindahkan data produk/custom dari orders lama ke order_items.
     */
    private function backfillFromOrders(): void
    {
        $orders = DB::table('orders')->get();

        foreach ($orders as $order) {
            $isCustom = ($order->order_type ?? 'ready_stock') === 'custom';
            $product = $order->product_id ? DB::table('products')->find($order->product_id) : null;

            $unitPrice = $isCustom
                ? (float) ($order->custom_price ?? 0)
                : (float) ($product?->price ?? 0);
            $qty = $isCustom
                ? (int) ($order->custom_quantity ?? 1)
                : (int) ($order->quantity ?? 1);
            $subtotal = $unitPrice * $qty;
            $dpp = round($subtotal / 1.11, 2);
            $ppn = round($dpp * 0.11, 2);

            DB::table('order_items')->insert([
                'order_id'              => $order->id,
                'product_id'            => $order->product_id,
                'line_type'             => $isCustom ? 'custom' : 'ready_stock',
                'product_name'          => $isCustom ? ($order->custom_requirements ?? 'Pesanan Custom') : ($product?->name ?? '-'),
                'quantity'              => $qty,
                'unit_price'            => $unitPrice,
                'custom_price'          => $isCustom ? $order->custom_price : null,
                'custom_requirements'   => $isCustom ? $order->custom_requirements : null,
                'custom_specifications' => $isCustom ? $order->custom_specifications : null,
                'custom_notes'          => $isCustom ? $order->custom_notes : null,
                'reference_file'        => $isCustom ? $order->reference_file : null,
                'dpp'                   => $dpp,
                'ppn'                   => $ppn,
                'created_at'            => $order->created_at ?? now(),
                'updated_at'            => $order->updated_at ?? now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
