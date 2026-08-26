<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('has_unread_for_admin')->default(false)->after('status_history');
            $table->boolean('has_unread_for_user')->default(false)->after('has_unread_for_admin');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['has_unread_for_admin', 'has_unread_for_user']);
        });
    }
};
