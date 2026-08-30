<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('the Morocco Shop home page can be displayed', function () {
    $this->get('/')
        ->assertOk();
});

test('the shipping and privacy policy pages can be displayed', function () {
    $this->get('/shipping-policy')
        ->assertOk();

    $this->get('/privacy-policy')
        ->assertOk();
});