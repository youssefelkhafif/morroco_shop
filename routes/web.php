<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImageController;
use App\Http\Controllers\Admin\DeliveryZoneController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\HomeController;

Route::get('/', HomeController::class)->name('home');

Route::get('/cart', [CartController::class, 'index'])
    ->name('cart.index');

Route::post('/cart/items', [CartController::class, 'store'])
    ->name('cart.items.store');

Route::patch('/cart/items/{product}', [CartController::class, 'update'])
    ->name('cart.items.update');

Route::delete('/cart/items/{product}', [CartController::class, 'destroy'])
    ->name('cart.items.destroy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'shop/account/index')->name('dashboard');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->as('admin.')
    ->group(function () {
        Route::inertia('/', 'admin/dashboard')->name('dashboard');
        Route::resource('categories', CategoryController::class)->except('show');
        Route::resource('products', ProductController::class)->except('show');
        Route::post(
            'products/{product}/images',
            [ProductImageController::class, 'store'],
        )->name('products.images.store');

        Route::delete(
            'products/{product}/images/{image}',
            [ProductImageController::class, 'destroy'],
        )->name('products.images.destroy');

        Route::resource('delivery-zones', DeliveryZoneController::class)
            ->except('show');

        Route::get('orders', [OrderController::class, 'index'])
            ->name('orders.index');

        Route::get('orders/{order}', [OrderController::class, 'show'])
            ->name('orders.show');

        Route::post('orders/{order}/confirm', [OrderController::class, 'confirm'])
            ->name('orders.confirm');

        Route::get(
            'orders/{order}/transport-pdf',
            [OrderController::class, 'transportPdf'],
        )->name('orders.transport-pdf');
    });

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
