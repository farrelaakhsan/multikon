<?php

namespace App\Models;

use App\Traits\HasUuidPrimaryKey;
use Illuminate\Database\Eloquent\Model;

class PaymentSetting extends Model
{
    use HasUuidPrimaryKey;
    protected $primaryKey = 'payment_setting_id';
    protected $keyType = 'string';
    public $incrementing = false;

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
        $methods = ['pending', 'qris', 'top'];
        foreach ($accounts as $i => $acc) {
            $methods[] = 'bank_' . $i;
        }
        return $methods;
    }
}
