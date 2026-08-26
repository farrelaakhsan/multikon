<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('shipped_at')->nullable()->after('settlement_verified_at');
        });

        $orders = DB::table('orders')->whereNull('shipped_at')->get(['id', 'status_history', 'status']);

        foreach ($orders as $order) {
            $history = json_decode((string) $order->status_history, true);
            if (! is_array($history)) {
                continue;
            }

            $shipped = collect($history)->first(fn ($h) => ($h['status'] ?? null) === 'shipped');
            if ($shipped && ! empty($shipped['timestamp'])) {
                try {
                    $timestamp = Carbon::parse($shipped['timestamp'])->format('Y-m-d H:i:s');
                } catch (\Throwable) {
                    continue;
                }

                DB::table('orders')
                    ->where('id', $order->id)
                    ->update(['shipped_at' => $timestamp]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('shipped_at');
        });
    }
};
