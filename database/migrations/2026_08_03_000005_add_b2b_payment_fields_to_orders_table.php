<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('po_document')->nullable()->after('reference_file');
            $table->string('po_verification_status')->nullable()->after('po_document'); // null | pending | verified
            $table->timestamp('po_verified_at')->nullable()->after('po_verification_status');
            $table->decimal('credit_used', 15, 2)->nullable()->after('po_verified_at');
            $table->timestamp('credit_restored_at')->nullable()->after('credit_used');
            $table->json('termin_bills')->nullable()->after('credit_restored_at');
            $table->json('paid_bills')->nullable()->after('termin_bills');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'po_document',
                'po_verification_status',
                'po_verified_at',
                'credit_used',
                'credit_restored_at',
                'termin_bills',
                'paid_bills',
            ]);
        });
    }
};