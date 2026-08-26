<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->string('district_id')->nullable()->after('address');
            $table->string('district_name')->nullable()->after('district_id');
            $table->string('subdistrict_id')->nullable()->after('district_name');
            $table->string('subdistrict_name')->nullable()->after('subdistrict_id');
            $table->string('city_id')->nullable()->after('subdistrict_name');
            $table->string('city_name')->nullable()->after('city_id');
        });
    }

    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn(['district_id', 'district_name', 'subdistrict_id', 'subdistrict_name', 'city_id', 'city_name']);
        });
    }
};
