<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('top_disabled')->default(false)->after('top_tenure_days');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('settlement_proof')->nullable()->after('paid_bills');
            $table->string('settlement_status')->nullable()->after('settlement_proof'); // null | pending | verified
            $table->timestamp('settlement_verified_at')->nullable()->after('settlement_status');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['settlement_proof', 'settlement_status', 'settlement_verified_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('top_disabled');
        });
    }
};