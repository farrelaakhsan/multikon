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
        Schema::table('products', function (Blueprint $table) {
            $table->text('specifications')->nullable()->after('price');
            $table->dropColumn(['material', 'dimensions_std']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('material')->nullable()->after('price');
            $table->string('dimensions_std')->nullable()->after('material');
            $table->dropColumn('specifications');
        });
    }
};
