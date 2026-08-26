<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPaymentSettingController extends Controller
{
    public function index(): Response
    {
        $settings = PaymentSetting::allAsArray();
        $bankAccounts = json_decode($settings['bank_accounts'] ?? '[]', true) ?? [];

        return Inertia::render('Admin/PaymentSettings/Index', [
            'settings' => [
                'bank_accounts'  => $bankAccounts,
                'qris_image_url' => $settings['qris_image']
                    ? asset('storage/qris/' . $settings['qris_image'])
                    : null,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        // ── Bank Accounts ──────────────────────────────────────────────────
        $raw = $request->input('bank_accounts', '[]');
        $bankAccounts = is_string($raw) ? (json_decode($raw, true) ?? []) : (is_array($raw) ? $raw : []);

        $cleaned = [];
        foreach ($bankAccounts as $acc) {
            $bank = trim($acc['bank'] ?? '');
            $account = trim($acc['account'] ?? '');
            $name = trim($acc['name'] ?? '');
            if ($bank !== '' || $account !== '' || $name !== '') {
                $cleaned[] = [
                    'bank'    => $bank,
                    'account' => $account,
                    'name'    => $name,
                ];
            }
        }

        PaymentSetting::updateOrCreate(
            ['key' => 'bank_accounts'],
            ['value' => json_encode($cleaned)]
        );

        // ── QRIS Image ─────────────────────────────────────────────────────
        if ($request->hasFile('qris_image')) {
            $request->validate([
                'qris_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            ]);

            // Hapus file QRIS lama sebelum simpan baru
            $existing = PaymentSetting::getValue('qris_image');
            if ($existing) {
                $oldPath = storage_path('app/public/qris/' . $existing);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            $filename = 'qris_' . time() . '.' . $request->file('qris_image')->extension();
            $request->file('qris_image')->storeAs('qris', $filename, 'public');

            PaymentSetting::updateOrCreate(
                ['key' => 'qris_image'],
                ['value' => $filename]
            );
        }

        if ($request->boolean('remove_qris')) {
            $existing = PaymentSetting::getValue('qris_image');
            if ($existing) {
                $path = storage_path('app/public/qris/' . $existing);
                if (file_exists($path)) {
                    unlink($path);
                }
            }
            PaymentSetting::updateOrCreate(
                ['key' => 'qris_image'],
                ['value' => null]
            );
        }

        return redirect()->route('admin.payment-settings.index')
            ->with('success', 'Pengaturan pembayaran berhasil disimpan.');
    }
}
