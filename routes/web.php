<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImageController;

Route::inertia('/', 'shop/home')->name('home');

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
    });

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
