<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Kolom stock, warranty (products) dan quantity (orders) sudah dibuat
        // oleh migrasi 2026_05_09_000001_create_all_tables — hanya ubah default
        // status order agar konsisten dengan status flow saat ini.
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('pending_payment')->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
        });
    }
};