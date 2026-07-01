<?php

test('the Morocco Shop home page can be displayed', function () {
    $this->get('/')
        ->assertOk();
});
