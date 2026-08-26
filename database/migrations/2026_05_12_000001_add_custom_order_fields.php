<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('order_type', ['ready_stock', 'custom'])->default('ready_stock')->after('order_code');
            $table->text('custom_requirements')->nullable()->after('notes');
            $table->text('custom_specifications')->nullable()->after('custom_requirements');
            $table->integer('custom_quantity')->default(1)->after('custom_specifications');
            $table->text('custom_notes')->nullable()->after('custom_quantity');
            $table->string('reference_file')->nullable()->after('custom_notes');
            $table->decimal('custom_price', 15, 2)->nullable()->after('reference_file');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'order_type',
                'custom_requirements',
                'custom_specifications',
                'custom_quantity',
                'custom_notes',
                'reference_file',
                'custom_price',
            ]);
        });
    }
};