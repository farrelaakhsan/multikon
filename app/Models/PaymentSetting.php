<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentSetting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function getValue(string $key): ?string
    {
        return static::where('key', $key)->value('value');
    }

    public static function allAsArray(): array
    {
        return static::pluck('value', 'key')->toArray();
    }

    public static function validPaymentMethods(): array
    {
        $settings = static::allAsArray();
        $accounts = json_decode($settings['bank_accounts'] ?? '[]', true) ?? [];
        $methods = ['pending', 'qris'];
        foreach ($accounts as $i => $acc) {
            $methods[] = 'bank_' . $i;
        }
        return $methods;
    }
}
