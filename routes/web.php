<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'shop/home')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'shop/account/index')->name('dashboard');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';