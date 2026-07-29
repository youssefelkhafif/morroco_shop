<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shop\AccountController;

/*
|--------------------------------------------------------------------------
| User Settings Routes
|--------------------------------------------------------------------------
|
| These routes handle user account settings, profile management,
| and security settings.
|
*/

Route::middleware(['auth', 'verified'])->prefix('')->group(function () {
    // Account & Notifications
    Route::get('/notification', [AccountController::class, 'index'])->name('notification');
    Route::post('/notification/mark-all-read', [AccountController::class, 'markAllAsRead'])->name('notification.markAllRead');

    // Settings
    Route::get('/settings', [AccountController::class, 'settings'])->name('settings');

    // Profile Updates
    Route::post('/account/profile', [AccountController::class, 'updateProfile'])->name('account.profile.update');

    // Password Updates
    Route::post('/account/password', [AccountController::class, 'updatePassword'])->name('account.password.update');
});



