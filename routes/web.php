<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;

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
    });

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';