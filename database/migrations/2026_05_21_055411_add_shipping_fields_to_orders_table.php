<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('courier_name')->nullable()->after('shipping_method');
            $table->string('tracking_number')->nullable()->after('courier_name');
            $table->string('driver_contact')->nullable()->after('tracking_number');
            $table->string('shipping_proof')->nullable()->after('driver_contact');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['courier_name', 'tracking_number', 'driver_contact', 'shipping_proof']);
        });
    }
};
