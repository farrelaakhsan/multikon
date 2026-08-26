<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('b2b_status')->default('none')->after('is_admin'); // none | pending | approved | rejected
            $table->decimal('credit_limit', 15, 2)->nullable()->after('b2b_status');
            $table->decimal('remaining_credit', 15, 2)->nullable()->after('credit_limit');
            $table->integer('top_tenure_days')->nullable()->after('remaining_credit');
            $table->timestamp('b2b_approved_at')->nullable()->after('top_tenure_days');
            $table->text('rejection_reason')->nullable()->after('b2b_approved_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'b2b_status',
                'credit_limit',
                'remaining_credit',
                'top_tenure_days',
                'b2b_approved_at',
                'rejection_reason',
            ]);
        });
    }
};
