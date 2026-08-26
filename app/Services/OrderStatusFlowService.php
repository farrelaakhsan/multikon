<?php

namespace App\Services;

use App\Models\Order;

class OrderStatusFlowService
{
    public function __construct()
    {
    }

    /**
     * Bangun array progress_steps untuk sebuah pesanan.
     *
     * @param Order  $order
     * @param string $view 'user' | 'admin'
     * @return array<int, array{key:string,label:string,done:bool,ts:?string,activeLabel:string,state:string}>
     */
    public function buildSteps(Order $order, string $view = 'user'): array
    {
        $isTop = $order->payment_method === Order::PAYMENT_TOP;
        $isTermin = $order->payment_method === Order::PAYMENT_TERMIN;
        $isCustom = $order->order_type === 'custom';

        // Status batal / PO ditolak → seluruh step ditandai cancelled.
        if ($order->status === 'cancelled' || $order->payment_status === 'failed') {
            return $this->markCancelled($isCustom, $isTop, $isTermin, $view);
        }

        $steps = $isTermin
            ? $this->terminSteps($order, $view)
            : ($isCustom
                ? $this->customSteps($order, $view)
                : ($isTop
                    ? $this->topReadyStockSteps($order, $view)
                    : $this->regularReadyStockSteps($order, $view)));

        return $this->assignStates($steps);
    }

    private function markCancelled(bool $isCustom, bool $isTop, bool $isTermin, string $view): array
    {
        if ($isCustom && $isTermin) {
            $labels = ['Pesanan dibuat', 'Peninjauan dan Harga', 'DP / Pembayaran awal', 'Produksi', 'Pelunasan', 'Penyiapan', 'Dikirim / diambil', 'Selesai'];
        } elseif ($isCustom) {
            $labels = ['Pesanan Dibuat', 'Peninjauan', 'Pembayaran', 'Diproduksi', 'Dikirim', 'Selesai'];
        } elseif ($isTop) {
            $labels = ['Pesanan Dibuat', 'Verifikasi PO', 'Diproses', 'Dikirim', 'Menunggu Pelunasan', 'Selesai'];
        } else {
            $labels = ['Pesanan Dibuat', 'Pembayaran', 'Verifikasi Admin', 'Diproses', 'Dikirim', 'Selesai'];
        }

        return collect($labels)->map(fn ($label) => [
            'key'          => 'x',
            'label'        => $label,
            'done'         => false,
            'ts'           => null,
            'activeLabel'  => '',
            'state'        => 'cancelled',
        ])->values()->all();
    }

    private function regularReadyStockSteps(Order $order, string $view): array
    {
        $isPaid = $order->payment_status === 'paid';
        $hasProof = (bool) $order->payment_proof;
        $status = $order->status;

        return [
            $this->step('created', 'Pesanan Dibuat', true, $order->created_at, ''),
            $this->step('proof', 'Pembayaran',
                $hasProof, $order->payment_proof ? $order->updated_at : null,
                $view === 'admin' ? 'Menunggu bukti pembayaran dari pelanggan' : 'Unggah bukti pembayaran Anda'),
            $this->step('verify', $view === 'admin' ? 'Verifikasi' : 'Verifikasi Admin',
                $isPaid, $isPaid ? ($order->updated_at) : null,
                $view === 'admin' ? 'Sedang memverifikasi pembayaran' : 'Admin sedang memverifikasi pembayaran'),
            $this->step('process', 'Diproses',
                in_array($status, ['shipped', 'waiting_settlement', 'completed']),
                null, 'Pesanan sedang diproses'),
            $this->step('shipping', $view === 'admin' ? 'Dikirim' : 'Dikirim / Siap Diambil',
                in_array($status, ['waiting_settlement', 'completed']),
                null, 'Pesanan dalam perjalanan atau siap diambil'),
            $this->step('completed', 'Selesai',
                $status === 'completed', null, ''),
        ];
    }

    private function topReadyStockSteps(Order $order, string $view): array
    {
        $poVerified = $order->po_verification_status === 'verified';
        $status = $order->status;

        return [
            $this->step('created', 'Pesanan Dibuat', true, $order->created_at, ''),
            $this->step('po', 'Verifikasi PO',
                $poVerified, $order->po_verified_at,
                $view === 'admin' ? 'Menunggu verifikasi PO dari pelanggan' : 'Menunggu verifikasi Purchase Order'),
            $this->step('process', 'Diproses',
                in_array($status, ['shipped', 'waiting_settlement', 'completed']),
                null, 'Pesanan sedang diproses'),
            $this->step('shipping', $view === 'admin' ? 'Dikirim' : 'Dikirim / Siap Diambil',
                in_array($status, ['waiting_settlement', 'completed']),
                null, 'Pesanan dalam perjalanan atau siap diambil'),
            $this->step('settlement', 'Menunggu Pelunasan (H+30)',
                $order->settlement_status === 'verified',
                $order->settlement_verified_at,
                $view === 'admin' ? 'Menunggu pelunasan dari pelanggan' : 'Tagihan tempo sedang dalam masa jatuh tempo'),
            $this->step('completed', 'Selesai / Lunas',
                $order->settlement_status === 'verified',
                $order->settlement_verified_at, ''),
        ];
    }

    private function customSteps(Order $order, string $view): array
    {
        $hasProof = (bool) $order->payment_proof;
        $isPaid = $order->payment_status === 'paid';
        $status = $order->status;

        return [
            $this->step('created', $view === 'admin' ? 'Pesanan Baru' : 'Pesanan Dibuat', true, $order->created_at, ''),
            $this->step('review', 'Peninjauan',
                $status !== 'waiting_review', null,
                $view === 'admin' ? 'Sedang meninjau kebutuhan pelanggan' : 'Admin sedang meninjau kebutuhan Anda'),
            $this->step('proof', 'Pembayaran',
                $hasProof, $order->updated_at,
                $view === 'admin' ? 'Menunggu bukti pembayaran dari pelanggan' : 'Lakukan pembayaran untuk melanjutkan'),
            $this->step('verify', $view === 'admin' ? 'Verifikasi' : 'Menunggu Verifikasi',
                $isPaid, $isPaid ? $order->updated_at : null,
                $view === 'admin' ? 'Sedang memverifikasi pembayaran' : 'Admin sedang memverifikasi pembayaran'),
            $this->step('production', $view === 'admin' ? 'Produksi' : 'Produksi',
                in_array($status, ['shipped', 'done']), null, 'Pesanan sedang difabrikasi'),
            $this->step('shipping', $view === 'admin' ? 'Pengiriman / Pickup' : 'Pengiriman / Pickup',
                $status === 'done', null, 'Pesanan dalam perjalanan atau siap diambil'),
            $this->step('completed', 'Selesai',
                $status === 'done', null, ''),
        ];
    }

    /**
     * Custom termin — 8 step: created → review → dp → produksi → pelunasan → penyiapan → dikirim → selesai.
     */
    private function terminSteps(Order $order, string $view): array
    {
        $bills = $order->termin_bills ?? [];
        $paidBills = $order->paid_bills ?? [];
        $status = $order->status;
        $hasBills = count($bills) > 0;

        $isBillPaid = fn (string $key) => in_array($key, $paidBills, true);

        $dpPaid = $hasBills && $isBillPaid('dp');
        $progressPaid = $hasBills && $isBillPaid('progress');
        $finalPaid = $hasBills && $isBillPaid('final');

        return [
            $this->step('created', 'Pesanan dibuat', true, $order->created_at, ''),
            $this->step('review', 'Peninjauan dan Harga',
                $status !== 'waiting_review', null,
                $view === 'admin' ? 'Sedang meninjau kebutuhan pelanggan' : 'Admin sedang meninjau kebutuhan Anda'),
            $this->step('bill_dp', 'DP / Pembayaran awal',
                $dpPaid, null,
                $view === 'admin' ? 'Menunggu bukti pembayaran DP dari pelanggan' : 'Bayar DP 40% untuk memulai produksi'),
            $this->step('bill_progress', 'Produksi',
                $progressPaid, null,
                $view === 'admin' ? 'Menunggu bukti pembayaran progres dari pelanggan' : 'Bayar 40% selama masa produksi'),
            $this->step('bill_final', 'Pelunasan',
                $finalPaid, null,
                $view === 'admin' ? 'Menunggu bukti pelunasan dari pelanggan' : 'Bayar 20% pelunasan sebelum pengiriman'),
            $this->step('penyiapan', 'Penyiapan',
                in_array($status, ['shipped', 'done', 'completed']), null,
                $view === 'admin' ? 'Konfirmasi data pengiriman atau siap diambil' : 'Menunggu pengiriman dari admin'),
            $this->step('shipping', 'Dikirim / diambil',
                in_array($status, ['done', 'completed']), null,
                'Pesanan dalam perjalanan atau siap diambil'),
            $this->step('completed', 'Selesai',
                in_array($status, ['done', 'completed']), null, ''),
        ];
    }

    /**
     * Helper step.
     */
    private function step(string $key, string $label, bool $done, mixed $ts, string $activeLabel): array
    {
        return [
            'key'          => $key,
            'label'        => $label,
            'done'         => $done,
            'ts'           => $ts ? $this->formatTs($ts) : null,
            'activeLabel'  => $activeLabel,
            'state'        => 'inactive',
        ];
    }

    /**
     * Assign state final setelah urutan runtun selesai.
     */
    private function assignStates(array $steps): array
    {
        $activeSet = false;
        foreach ($steps as &$s) {
            if ($s['done']) {
                $s['state'] = 'complete';
            } elseif (! $activeSet) {
                $s['state'] = 'active';
                $activeSet = true;
            } else {
                $s['state'] = 'inactive';
            }
        }
        unset($s);

        return $steps;
    }

    private function formatTs($value): string
    {
        if ($value instanceof \DateTimeInterface) {
            return $value->format('d M Y, H:i');
        }

        return (string) $value;
    }
}