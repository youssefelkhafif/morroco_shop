<?php

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('allows a guest to add a product while always using the database price', function () {
    $product = Product::factory()->create([
        'name' => 'Wireless Headphones',
        'price_mad' => '499.99',
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
        'price_mad' => '0.01',
    ])->assertRedirect(route('cart.index'))
        ->assertSessionHas("morocco_shop.cart.{$product->id}", 2);

    $this->get(route('cart.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('shop/cart/index')
                ->where('cart.item_count', 2)
                ->where('cart.subtotal_mad', '999.98')
                ->where('cart.items.0.name', 'Wireless Headphones')
                ->where('cart.items.0.price_mad', '499.99')
                ->where('cart.items.0.line_total_mad', '999.98'),
        );
});

it('adds quantities together but never beyond current stock', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 3,
        'is_active' => true,
    ]);

    $this->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ])->assertRedirect(route('cart.index'));

    $this->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ])->assertRedirect(route('cart.index'))
        ->assertSessionHas("morocco_shop.cart.{$product->id}", 3);

    $this->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ])->assertSessionHasErrors('quantity');
});

it('rejects unavailable products for guests', function () {
    $product = Product::factory()->create([
        'is_active' => false,
        'stock_quantity' => 10,
    ]);

    $this->post(route('cart.items.store'), [
        'product_id' => $product->id,
        'quantity' => 1,
    ])->assertSessionHasErrors('product_id');

    expect(
        session()->has("morocco_shop.cart.{$product->id}"),
    )->toBeFalse();
});

it('allows a guest to update quantity and remove an item', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 5,
        'is_active' => true,
    ]);

    $this->withSession([
        'morocco_shop.cart' => [
            $product->id => 2,
        ],
    ])->patch(route('cart.items.update', $product), [
        'quantity' => 4,
    ])->assertRedirect(route('cart.index'))
        ->assertSessionHas("morocco_shop.cart.{$product->id}", 4);

    $this->patch(route('cart.items.update', $product), [
        'quantity' => 0,
    ])->assertRedirect(route('cart.index'))
        ->assertSessionMissing('morocco_shop.cart');
});

it('cleans stale items and reduces cart quantity when stock changed', function () {
    $product = Product::factory()->create([
        'price_mad' => '100.00',
        'stock_quantity' => 2,
        'is_active' => true,
    ]);

    $this->withSession([
        'morocco_shop.cart' => [
            $product->id => 5,
            999999 => 4,
        ],
    ])->get(route('cart.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('shop/cart/index')
                ->where('cart.item_count', 2)
                ->where('cart.subtotal_mad', '200.00')
                ->has('cart.items', 1)
                ->where('cart.items.0.quantity', 2),
        )
        ->assertSessionHas('morocco_shop.cart', [
            $product->id => 2,
        ]);
});
