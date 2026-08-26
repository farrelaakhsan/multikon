<?php

namespace App\Http\Middleware;

use App\Models\B2bApplication;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $paymentSettings = PaymentSetting::allAsArray();
        $bankAccounts = json_decode($paymentSettings['bank_accounts'] ?? '[]', true) ?? [];

        return array_merge(parent::share($request), [
            'appName' => config('app.name'),
            'auth'    => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'cartCount' => fn () => $request->user()?->cartItems()->count() ?? 0,
            'activeOrderCount' => fn () => $request->user()
                ?->orders()
                ->whereNotIn('status', ['completed', 'done', 'cancelled'])
                ->count() ?? 0,
            'pendingB2bCount' => fn () => $request->user()?->is_admin
                ? B2bApplication::where('status', 'pending')->count()
                : 0,
            'paymentSettings' => [
                'bank_accounts'  => $bankAccounts,
                'qris_image_url' => $paymentSettings['qris_image']
                    ? asset('storage/qris/' . $paymentSettings['qris_image'])
                    : null,
            ],
        ]);
    }
}