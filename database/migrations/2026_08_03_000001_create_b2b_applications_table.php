<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('b2b_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('pending'); // pending | approved | rejected
            $table->string('company_name');
            $table->string('company_npwp');
            $table->string('npwp_file');
            $table->string('nib_file')->nullable();
            $table->string('siup_file')->nullable();
            $table->decimal('credit_limit', 15, 2)->nullable();
            $table->integer('top_tenure_days')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('b2b_applications');
    }
};
