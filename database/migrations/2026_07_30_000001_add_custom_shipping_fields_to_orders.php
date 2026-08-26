<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('estimated_weight', 10, 2)->nullable()->after('shipping_cost');
            $table->string('subdistrict_id', 50)->nullable()->after('estimated_weight');
            $table->string('subdistrict_name', 255)->nullable()->after('subdistrict_id');
            $table->string('district_name', 255)->nullable()->after('subdistrict_name');
            $table->string('city_name', 255)->nullable()->after('district_name');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['estimated_weight', 'subdistrict_id', 'subdistrict_name', 'district_name', 'city_name']);
        });
    }
};
