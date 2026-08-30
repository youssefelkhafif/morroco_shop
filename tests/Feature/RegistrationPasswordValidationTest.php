<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('registration rejects duplicate emails but allows duplicate passwords', function () {
    User::factory()->create([
        'email' => 'existing@example.com',
        'password' => bcrypt('StrongPass!123'),
    ]);

    $response = $this->post(route('register'), [
        'name' => 'New User',
        'email' => 'new@example.com',
        'password' => 'StrongPass!123',
        'password_confirmation' => 'StrongPass!123',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', ['email' => 'new@example.com']);
});

test('registration returns explicit password rules when password is too weak', function () {
    $response = $this->post(route('register'), [
        'name' => 'Weak User',
        'email' => 'weak@example.com',
        'password' => 'short',
        'password_confirmation' => 'short',
    ]);

    $response->assertSessionHasErrors([
        'password' => 'The password must be at least 8 characters. The password must include at least one uppercase letter. The password must include at least one symbol.',
    ]);
});
