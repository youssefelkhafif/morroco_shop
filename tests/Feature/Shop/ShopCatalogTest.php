<?php

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shows active products and the current session cart count on the shop home page', function () {
    $activeProduct = Product::factory()->create([
        'name' => 'Wireless Headphones',
        'price_mad' => '499.99',
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    Product::factory()->create([
        'name' => 'Hidden Product',
        'stock_quantity' => 10,
        'is_active' => false,
    ]);

    $this->withSession([
        'morocco_shop.cart' => [
            $activeProduct->id => 2,
        ],
    ])->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('shop/home')
            ->where('cart_item_count', 2)
            ->where('hero_badge', 'CASH ON DELIVERY · MOROCCO')
            ->where('hero_title', 'Streetwear caps, refined for everyday wear.')
            ->where('hero_subtitle', 'Minimal silhouettes, premium finishing, and a sharp fit from first impression to final delivery.')
            ->has('products.data', 1)
            ->where('products.data.0.id', $activeProduct->id)
            ->where('products.data.0.name', 'Wireless Headphones')
            ->where('products.data.0.price_mad', '499.99'),
        );
});