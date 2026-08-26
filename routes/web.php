<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\B2bApplicationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FrontController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminB2bController;
use App\Http\Controllers\Admin\AdminChatController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminPaymentSettingController;
use App\Http\Controllers\Admin\AdminProductController;
use Illuminate\Support\Facades\Route;

Route::get('/',          [FrontController::class, 'index'])->name('home');
Route::get('/catalog',   [FrontController::class, 'catalog'])->name('catalog');
Route::get('/catalog/{product}', [FrontController::class, 'show'])->name('product.show');
Route::get('/about',              [FrontController::class, 'about'])->name('about');
Route::get('/cara-belanja',       [FrontController::class, 'caraBelanja'])->name('cara-belanja');
Route::get('/faq',                [FrontController::class, 'faq'])->name('faq');
Route::get('/kebijakan-privasi',  [FrontController::class, 'kebijakanPrivasi'])->name('kebijakan-privasi');
Route::get('/syarat-ketentuan',   [FrontController::class, 'syaratKetentuan'])->name('syarat-ketentuan');
Route::get('/tentang-aplikasi',   [FrontController::class, 'tentangAplikasi'])->name('tentang-aplikasi');


Route::post('/chatbot/message', [ChatbotController::class, 'message'])->name('chatbot.message');


Route::middleware(['auth'])->prefix('chat')->name('chat.')->group(function () {
    Route::post('/message', [ChatController::class, 'store'])->name('message');
    Route::get('/poll',    [ChatController::class, 'poll'])->name('poll');
});


Route::middleware(['auth'])->prefix('cart')->name('cart.')->group(function () {
    Route::get('/',               [CartController::class, 'index'])->name('index');
    Route::post('/',              [CartController::class, 'store'])->name('store');
    Route::get('/checkout',        [CartController::class, 'checkoutPage'])->name('checkout-page');
    Route::post('/checkout',       [CartController::class, 'checkout'])->name('checkout');
    Route::patch('/{cartItem}',    [CartController::class, 'update'])->name('update');
    Route::delete('/{cartItem}',   [CartController::class, 'destroy'])->name('destroy');
});


Route::middleware(['auth'])->prefix('addresses')->name('addresses.')->group(function () {
    Route::get('/',                        [AddressController::class, 'index'])->name('index');
    Route::post('/',                       [AddressController::class, 'store'])->name('store');
    Route::patch('/{address}',             [AddressController::class, 'update'])->name('update');
    Route::delete('/{address}',           [AddressController::class, 'destroy'])->name('destroy');
    Route::post('/{address}/default',      [AddressController::class, 'setDefault'])->name('setDefault');
});


Route::middleware(['auth'])->group(function () {
    Route::post('/shipping-cost', [CartController::class, 'shippingCost'])->name('shipping.cost');
    Route::get('/shipping-cost/search', [CartController::class, 'searchDestination'])->name('shipping.search');
    Route::get('/shipping-cost/provinces', [CartController::class, 'getProvinces'])->name('shipping.provinces');
    Route::get('/shipping-cost/cities/{provinceId}', [CartController::class, 'getCities'])->name('shipping.cities');
    Route::get('/shipping-cost/districts/{cityId}', [CartController::class, 'getDistricts'])->name('shipping.districts');
});


Route::middleware(['auth'])->prefix('b2b')->name('b2b.')->group(function () {
    Route::get('/',        [B2bApplicationController::class, 'show'])->name('show');
    Route::get('/dashboard', [B2bApplicationController::class, 'dashboard'])->name('dashboard');
    Route::post('/',       [B2bApplicationController::class, 'store'])->name('store');
});


Route::middleware(['auth'])->prefix('settings')->name('settings.')->group(function () {
    Route::get('/',              [SettingsController::class, 'index'])->name('index');
    Route::get('/addresses',     [SettingsController::class, 'addresses'])->name('addresses');
    Route::get('/profile',       [SettingsController::class, 'profile'])->name('profile');
    Route::post('/profile',      [SettingsController::class, 'updateProfile'])->name('profile.update');
    Route::post('/password',     [SettingsController::class, 'updatePassword'])->name('password.update');
});


Route::middleware(['auth'])->group(function () {
    Route::get('/order/payment/{orderCode}',          [OrderController::class, 'payment'])->name('order.payment');
    Route::post('/order/payment/{orderCode}',         [OrderController::class, 'prosesPayment'])->name('order.prosesPayment');
    Route::get('/order/{orderCode}/custom-payment',   [OrderController::class, 'customPayment'])->name('order.customPayment');
    Route::post('/order/{orderCode}/custom-payment',  [OrderController::class, 'prosesCustomPayment'])->name('order.prosesCustomPayment');

    Route::get('/custom-order/create',                [OrderController::class, 'createCustom'])->name('custom.create');
    Route::post('/custom-order',                      [OrderController::class, 'storeCustom'])->name('custom.store');

    // Pesanan Saya
    Route::get('/orders',                                 [OrderController::class, 'myOrders'])->name('orders.my');
    Route::patch('/orders/{order}/payment-method',        [OrderController::class, 'updatePaymentMethod'])->name('orders.updatePaymentMethod');
    Route::post('/orders/{order}/confirm-received',        [OrderController::class, 'confirmReceived'])->name('orders.confirmReceived');
    Route::post('/orders/{order}/settlement',              [OrderController::class, 'uploadSettlement'])->name('orders.settlement');
    Route::post('/orders/{order}/termin-bill',             [OrderController::class, 'uploadTerminBill'])->name('orders.terminBill');

    // Unduh dokumen PDF (pemilik order / admin)
    Route::get('/orders/{order}/documents/{document}',    [OrderController::class, 'downloadDocument'])->name('orders.document.buyer');

    // Shipping cost calculation & selection
    Route::post('/orders/{order}/shipping-cost',          [OrderController::class, 'calculateShipping'])->name('orders.shippingCost');
    Route::patch('/orders/{order}/shipping',              [OrderController::class, 'selectShipping'])->name('orders.selectShipping');
});


Route::get('/order/{orderCode}/tracking', [OrderController::class, 'tracking'])->name('order.tracking');


Route::get('/po-template', [OrderController::class, 'poTemplate'])->name('order.poTemplate');


Route::middleware('auth')
    ->get('/dashboard', fn () => redirect()->route('home'))
    ->name('dashboard');


Route::middleware('guest')
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/login',  [AdminAuthController::class, 'create'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'store'])
            ->middleware('throttle:5,60');
    });


Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/',           [AdminController::class, 'dashboard'])->name('dashboard');

        // Products CRUD
        Route::get('/products',              [AdminProductController::class, 'index'])->name('products.index');
        Route::get('/products/create',       [AdminProductController::class, 'create'])->name('products.create');
        Route::post('/products',             [AdminProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
        Route::put('/products/{product}',    [AdminProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');

        // Orders
        Route::get('/orders',                            [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}',                   [AdminOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/status',          [AdminOrderController::class, 'updateStatus'])->name('orders.updateStatus');
        Route::post('/orders/{order}/confirm-payment',  [AdminOrderController::class, 'confirmPayment'])->name('orders.confirmPayment');
        Route::post('/orders/{order}/reject-payment',   [AdminOrderController::class, 'rejectPayment'])->name('orders.rejectPayment');
        Route::post('/orders/{order}/confirm-settlement', [AdminOrderController::class, 'confirmSettlement'])->name('orders.confirmSettlement');
        Route::post('/orders/{order}/shipping',         [AdminOrderController::class, 'storeShipping'])->name('orders.storeShipping');
        Route::post('/orders/{order}/verify-po',        [AdminOrderController::class, 'verifyPo'])->name('orders.verifyPo');

        // Dokumen PDF
        Route::get('/orders/{order}/documents/{document}',  [AdminOrderController::class, 'downloadDocument'])->name('orders.document');
        Route::post('/orders/{order}/documents/{document}/issue', [AdminOrderController::class, 'issueDocument'])->name('orders.issueDocument');

        // Custom Order - Admin actions
        Route::patch('/orders/{order}/set-price',       [AdminOrderController::class, 'setCustomPrice'])->name('orders.setPrice');

        // Chat Konsultasi Custom
        Route::get('/chats',                         [AdminChatController::class, 'index'])->name('chats.index');
        Route::get('/chats/{conversation}',          [AdminChatController::class, 'show'])->name('chats.show');
        Route::post('/chats/{conversation}/reply',   [AdminChatController::class, 'reply'])->name('chats.reply');

        // B2B Applications
        Route::get('/b2b',                           [AdminB2bController::class, 'index'])->name('b2b.index');
        Route::get('/b2b/manage',                    [AdminB2bController::class, 'manage'])->name('b2b.manage');
        Route::patch('/b2b/{user}/credit',           [AdminB2bController::class, 'updateCredit'])->name('b2b.updateCredit');
        Route::post('/b2b/{user}/toggle-top',        [AdminB2bController::class, 'toggleTop'])->name('b2b.toggleTop');
        Route::get('/b2b/{application}',             [AdminB2bController::class, 'show'])->name('b2b.show');
        Route::post('/b2b/{application}/approve',    [AdminB2bController::class, 'approve'])->name('b2b.approve');
        Route::post('/b2b/{application}/reject',     [AdminB2bController::class, 'reject'])->name('b2b.reject');

        // Payment Settings
        Route::get('/payment-settings',              [AdminPaymentSettingController::class, 'index'])->name('payment-settings.index');
        Route::post('/payment-settings',             [AdminPaymentSettingController::class, 'update'])->name('payment-settings.update');
    });

require __DIR__ . '/auth.php';