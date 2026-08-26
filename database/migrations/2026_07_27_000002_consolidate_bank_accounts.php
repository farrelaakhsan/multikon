<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $oldKeys = [
            'bank_bca_account',
            'bank_bca_name',
            'bank_bri_account',
            'bank_bri_name',
            'bank_mandiri_account',
            'bank_mandiri_name',
        ];

        $rows = DB::table('payment_settings')->whereIn('key', $oldKeys)->get()->keyBy('key');

        $accounts = [];

        $banks = [
            'BCA'    => ['account' => 'bank_bca_account',    'name' => 'bank_bca_name'],
            'BRI'    => ['account' => 'bank_bri_account',    'name' => 'bank_bri_name'],
            'Mandiri' => ['account' => 'bank_mandiri_account', 'name' => 'bank_mandiri_name'],
        ];

        foreach ($banks as $bank => $fields) {
            $account = $rows[$fields['account']]->value ?? null;
            $name    = $rows[$fields['name']]->value ?? null;
            if ($account && $name) {
                $accounts[] = ['bank' => $bank, 'account' => $account, 'name' => $name];
            }
        }

        DB::table('payment_settings')->updateOrInsert(
            ['key' => 'bank_accounts'],
            ['value' => json_encode($accounts), 'updated_at' => now(), 'created_at' => now()]
        );

        DB::table('payment_settings')->whereIn('key', $oldKeys)->delete();
    }

    public function down(): void
    {
        $accounts = json_decode(DB::table('payment_settings')->where('key', 'bank_accounts')->value('value') ?? '[]', true) ?? [];

        $inserts = [];
        $banks = ['BCA' => 'bank_bca', 'BRI' => 'bank_bri', 'Mandiri' => 'bank_mandiri'];
        foreach ($accounts as $acc) {
            $prefix = $banks[$acc['bank']] ?? null;
            if ($prefix) {
                $inserts[] = ['key' => $prefix . '_account', 'value' => $acc['account'], 'created_at' => now(), 'updated_at' => now()];
                $inserts[] = ['key' => $prefix . '_name',    'value' => $acc['name'],    'created_at' => now(), 'updated_at' => now()];
            }
        }

        if (!empty($inserts)) {
            DB::table('payment_settings')->insert($inserts);
        }

        DB::table('payment_settings')->where('key', 'bank_accounts')->delete();
    }
};
