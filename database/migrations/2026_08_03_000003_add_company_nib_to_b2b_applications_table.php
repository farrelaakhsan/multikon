<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('b2b_applications', function (Blueprint $table) {
            $table->string('company_nib')->nullable()->after('company_npwp');
        });
    }

    public function down(): void
    {
        Schema::table('b2b_applications', function (Blueprint $table) {
            $table->dropColumn('company_nib');
        });
    }
};
