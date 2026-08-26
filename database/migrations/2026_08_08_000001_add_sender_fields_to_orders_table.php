<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('sender_bank_name')->nullable()->after('payment_proof');
            $table->date('transfer_date')->nullable()->after('sender_bank_name');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['sender_bank_name', 'transfer_date']);
        });
    }
};
