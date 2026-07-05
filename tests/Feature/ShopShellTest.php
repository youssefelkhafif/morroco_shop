<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('the Morocco Shop home page can be displayed', function () {
    $this->get('/')
        ->assertOk();
});