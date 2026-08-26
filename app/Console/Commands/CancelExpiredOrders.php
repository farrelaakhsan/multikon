<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\User;
use Illuminate\Console\Command;

class CancelExpiredOrders extends Command
{
    protected $signature = 'orders:cancel-expired';
    protected $description = 'Batalkan pesanan yang melewati tenggat pembayaran';

    public function handle(): int
    {
        $now = now();

        $expired = Order::whereNotNull('payment_deadline')
            ->where('payment_deadline', '<', $now)
            ->whereIn('status', ['pending_payment', 'waiting_confirmation'])
            ->where('payment_status', 'pending')
            ->get();

        if ($expired->isEmpty()) {
            $this->info('Tidak ada pesanan kedaluwarsa.');
            return self::SUCCESS;
        }

        $count = 0;

        foreach ($expired as $order) {
            $order->update([
                'status'         => 'cancelled',
                'payment_status' => 'failed',
            ]);

            $order->trackStatus('cancelled', 'Dibatalkan otomatis — tenggat pembayaran habis');

            $this->restoreCredit($order);

            $count++;
            $this->line("  Dibatalkan: {$order->order_code}");
        }

        $this->info("Total {$count} pesanan dibatalkan.");
        return self::SUCCESS;
    }

    private function restoreCredit(Order $order): void
    {
        $creditUsed = (float) ($order->credit_used ?? 0);
        if ($creditUsed <= 0 || $order->credit_restored_at) {
            return;
        }

        $user = $order->user;
        if ($user) {
            $user->increment('remaining_credit', $creditUsed);
        }

        $order->forceFill(['credit_restored_at' => now()])->save();
    }
}
