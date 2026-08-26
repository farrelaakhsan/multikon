<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        DB::table('payment_settings')->insert([
            ['key' => 'bank_bca_account',   'value' => '123 456 7890',       'created_at' => now(), 'updated_at' => now()],
            ['key' => 'bank_bca_name',       'value' => 'CV Multikon Erindotama', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'bank_bri_account',    'value' => '0987 6543 2100',     'created_at' => now(), 'updated_at' => now()],
            ['key' => 'bank_bri_name',       'value' => 'CV Multikon Erindotama', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'bank_mandiri_account','value' => '112 233 4455 66',   'created_at' => now(), 'updated_at' => now()],
            ['key' => 'bank_mandiri_name',   'value' => 'CV Multikon Erindotama', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'qris_image',          'value' => null,                 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_settings');
    }
};
