<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImageController;
use App\Http\Controllers\Admin\DeliveryZoneController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ThemeController;
use App\Http\Controllers\Admin\CollectionController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CollectionController as ShopCollectionController;
use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\AccountController;
use App\Http\Controllers\Shop\ProductController as ShopProductController;

Route::get('/', HomeController::class)->name('home');
Route::get('/about', function () {
    return inertia('shop/about', [
        'shop_instagram' => config('shop.instagram.handle'),
    ]);
})->name('about');
Route::get('/contact', function () {
    return inertia('shop/contact', [
        'contact_email' => config('shop.contact.email'),
        'contact_phone' => config('shop.contact.phone'),
    ]);
})->name('contact');
Route::get('/collections', [ShopCollectionController::class, 'index'])
    ->name('collections.index');
Route::get('/collections/{collection}', [ShopCollectionController::class, 'show'])
    ->name('collections.show');
Route::get('/products', [ShopProductController::class, 'index'])
    ->name('products.index');
Route::get('/products/{product}', [ShopProductController::class, 'show'])
    ->name('products.show');

Route::get('/cart', [CartController::class, 'index'])
    ->name('cart.index');

Route::post('/cart/items', [CartController::class, 'store'])
    ->name('cart.items.store');

Route::patch('/cart/items/{product}', [CartController::class, 'update'])
    ->name('cart.items.update');

Route::delete('/cart/items/{product}', [CartController::class, 'destroy'])
    ->name('cart.items.destroy');

Route::get('/checkout', [CheckoutController::class, 'index'])
    ->name('checkout.index');

Route::post('/checkout', [CheckoutController::class, 'store'])
    ->name('checkout.store');

Route::middleware(['auth', 'verified'])->group(function () {
    // Account settings handled in settings.php
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

        Route::resource('themes', ThemeController::class)->except('show');
        Route::resource('collections', CollectionController::class)->except('show');

        Route::get('orders', [OrderController::class, 'index'])
            ->name('orders.index');

        Route::get('orders/{order}', [OrderController::class, 'show'])
            ->name('orders.show');

        Route::post('orders/{order}/confirm', [OrderController::class, 'confirm'])
            ->name('orders.confirm');

        Route::post('orders/{order}/cancel', [OrderController::class, 'cancel'])
            ->name('orders.cancel');

        Route::post('orders/{order}/prepare', [OrderController::class, 'prepare'])
            ->name('orders.prepare');

        Route::post('orders/{order}/ship', [OrderController::class, 'ship'])
            ->name('orders.ship');

        Route::post('orders/{order}/deliver', [OrderController::class, 'deliver'])
            ->name('orders.deliver');

        Route::post(
            'orders/{order}/carrier-tracking',
            [OrderController::class, 'assignCarrierAndTracking'],
        )->name('orders.assign-carrier-tracking');

        Route::get(
            'orders/{order}/transport-pdf',
            [OrderController::class, 'transportPdf'],
        )->name('orders.transport-pdf');
    });

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';

Route::fallback(function () {
    return inertia('shop/not-found');
});
