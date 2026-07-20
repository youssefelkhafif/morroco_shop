<?php

use App\Models\DeliveryZone;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function checkoutPayload(DeliveryZone $deliveryZone): array
{
    return [
        'customer_name' => 'Youssef Elkhafif',
        'customer_phone' => '0612345678',
        'customer_email' => 'youssef@example.test',
        'delivery_zone_id' => $deliveryZone->id,
        'delivery_address' => '123 Test Street, Casablanca',
        'customer_note' => 'Call before delivery.',
    ];
}

it('redirects guests to the cart when checkout is opened with an empty cart', function () {
    $this->get(route('checkout.index'))
        ->assertRedirect(route('cart.index'))
        ->assertSessionHas('error');
});

it('shows checkout with active delivery zones and session cart data', function () {
    $product = Product::factory()->create([
        'price_mad' => '100.00',
        'stock_quantity' => 5,
        'is_active' => true,
    ]);

    $zone = DeliveryZone::factory()->create([
        'city' => 'Casablanca',
        'district' => 'Anassi',
        'zone_name' => 'Standard',
        'delivery_fee_mad' => '25.00',
        'is_active' => true,
    ]);

    DeliveryZone::factory()->create([
        'is_active' => false,
    ]);

    $this->withSession([
        'morocco_shop.cart' => [
            $product->id => 2,
        ],
    ])->get(route('checkout.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('shop/checkout/index')
            ->where('cart.item_count', 2)
            ->where('cart.subtotal_mad', '200.00')
            ->has('delivery_zones', 1)
            ->where('delivery_zones.0.id', $zone->id)
            ->where('delivery_zones.0.delivery_fee_mad', '25.00'),
        );
});

it('creates a guest order from session cart and saves the order for admin confirmation', function () {
    $product = Product::factory()->create([
        'name' => 'Wireless Headphones',
        'slug' => 'wireless-headphones',
        'price_mad' => '499.99',
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $zone = DeliveryZone::factory()->create([
        'city' => 'Casablanca',
        'district' => 'Anassi',
        'zone_name' => 'Standard',
        'delivery_fee_mad' => '25.00',
        'is_active' => true,
    ]);

    $response = $this
        ->withHeader('X-Inertia', 'true')
        ->withSession([
            'morocco_shop.cart' => [
                $product->id => 2,
            ],
        ])
        ->post(route('checkout.store'), checkoutPayload($zone));

    $response->assertRedirect(route('checkout.index'))
        ->assertSessionHas('success')
        ->assertSessionHas('orderPlaced', true);

    $order = Order::query()->sole();

    expect($order->customer_id)->toBeNull()
        ->and($order->status)->toBe(Order::STATUS_PENDING_WHATSAPP_CONFIRMATION)
        ->and($order->subtotal_mad)->toBe('999.98')
        ->and($order->delivery_fee_mad)->toBe('25.00')
        ->and($order->total_mad)->toBe('1024.98')
        ->and($order->cod_amount_mad)->toBe('1024.98')
        ->and($order->items)->toHaveCount(1)
        ->and($order->items->first()->quantity)->toBe(2);

    expect(session()->has('morocco_shop.cart'))->toBeFalse();
    expect($product->fresh()->stock_quantity)->toBe(10);
});

it('links an authenticated customer to the created checkout order', function () {
    $customer = User::factory()->create([
        'email' => 'customer@example.test',
    ]);

    $product = Product::factory()->create([
        'stock_quantity' => 4,
        'is_active' => true,
    ]);

    $zone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $this->actingAs($customer)
        ->withHeader('X-Inertia', 'true')
        ->withSession([
            'morocco_shop.cart' => [
                $product->id => 1,
            ],
        ])
        ->post(route('checkout.store'), [
            ...checkoutPayload($zone),
            'customer_email' => null,
        ])
        ->assertRedirect(route('checkout.index'))
        ->assertSessionHas('success')
        ->assertSessionHas('orderPlaced', true);

    expect(Order::query()->sole()->customer_id)->toBe($customer->id)
        ->and(Order::query()->sole()->customer_email)->toBe(
            'customer@example.test',
        );
});

it('creates an order when WhatsApp is not configured', function () {
    $product = Product::factory()->create([
        'stock_quantity' => 4,
        'is_active' => true,
    ]);

    $zone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $this->withSession([
        'morocco_shop.cart' => [
            $product->id => 1,
        ],
    ])->post(route('checkout.store'), checkoutPayload($zone))
        ->assertRedirect(route('checkout.index'))
        ->assertSessionHas('success')
        ->assertSessionHas('orderPlaced', true);

    expect(Order::count())->toBe(1)
        ->and(session()->has('morocco_shop.cart'))->toBeFalse();
});