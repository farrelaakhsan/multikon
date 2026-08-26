<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Dokumen PDF terbitan (Commercial Invoice, Faktur Pajak, Surat Jalan).
 * Satu order memiliki lebih dari satu dokumen (contoh: Faktur Pajak per
 * tagihan Termin). Metadata menyimpan snapshot seperti bill_key & order_code.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // commercial_invoice | faktur_pajak | surat_jalan
            $table->string('document_number')->nullable();
            $table->string('file_path');
            $table->timestamp('issued_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_documents');
    }
};