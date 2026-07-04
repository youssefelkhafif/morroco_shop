<?php

use App\Models\DeliveryZone;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('supports a guest order without a customer account', function () {
    $order = Order::factory()->create([
        'customer_id' => null,
    ]);

    expect($order->customer_id)->toBeNull()
        ->and($order->customer)->toBeNull()
        ->and($order->status)
        ->toBe(Order::STATUS_PENDING_WHATSAPP_CONFIRMATION)
        ->and($order->payment_method)
        ->toBe(Order::PAYMENT_METHOD_CASH_ON_DELIVERY);
});

it('can belong to a logged in customer', function () {
    $customer = User::factory()->create();

    $order = Order::factory()
        ->for($customer, 'customer')
        ->create();

    expect($order->customer->is($customer))->toBeTrue()
        ->and($customer->orders()->count())->toBe(1);
});

it('keeps delivery details as order snapshots', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'city' => 'Casablanca',
        'district' => 'Anassi',
        'zone_name' => 'Standard',
        'delivery_fee_mad' => '25.00',
    ]);

    $order = Order::factory()->create([
        'delivery_zone_id' => $deliveryZone->id,
        'delivery_city' => 'Casablanca',
        'delivery_district' => 'Anassi',
        'delivery_zone_name' => 'Standard',
        'delivery_fee_mad' => '25.00',
    ]);

    $deliveryZone->update([
        'city' => 'Rabat',
        'district' => 'Agdal',
        'zone_name' => 'Express',
        'delivery_fee_mad' => '40.00',
    ]);

    $order->refresh();

    expect($order->delivery_city)->toBe('Casablanca')
        ->and($order->delivery_district)->toBe('Anassi')
        ->and($order->delivery_zone_name)->toBe('Standard')
        ->and($order->delivery_fee_mad)->toBe('25.00');
});

it('keeps product details as order item snapshots', function () {
    $product = Product::factory()->create([
        'name' => 'Wireless Headphones',
        'slug' => 'wireless-headphones',
        'price_mad' => '499.99',
    ]);

    $order = Order::factory()->create();

    $orderItem = OrderItem::factory()
        ->for($order)
        ->for($product)
        ->create([
            'product_name' => 'Wireless Headphones',
            'product_slug' => 'wireless-headphones',
            'unit_price_mad' => '499.99',
            'quantity' => 2,
            'line_total_mad' => '999.98',
        ]);

    $product->update([
        'name' => 'Wireless Headphones Pro',
        'slug' => 'wireless-headphones-pro',
        'price_mad' => '699.99',
    ]);

    $orderItem->refresh();

    expect($orderItem->product_name)->toBe('Wireless Headphones')
        ->and($orderItem->product_slug)->toBe('wireless-headphones')
        ->and($orderItem->unit_price_mad)->toBe('499.99')
        ->and($orderItem->quantity)->toBe(2)
        ->and($orderItem->line_total_mad)->toBe('999.98');
});

it('uses only the allowed Morocco Shop order statuses', function () {
    expect(Order::statuses())->toBe([
        Order::STATUS_PENDING_WHATSAPP_CONFIRMATION,
        Order::STATUS_CONFIRMED,
        Order::STATUS_PREPARING,
        Order::STATUS_SHIPPED,
        Order::STATUS_DELIVERED,
        Order::STATUS_CANCELLED,
        Order::STATUS_NO_ANSWER,
        Order::STATUS_REFUSED_AT_DELIVERY,
        Order::STATUS_RETURNED,
    ]);
});

it('starts with inventory not deducted', function () {
    $order = Order::factory()->create([
        'stock_deducted_at' => null,
    ]);

    expect($order->hasStockBeenDeducted())->toBeFalse();

    $order->update([
        'stock_deducted_at' => now(),
    ]);

    expect($order->fresh()->hasStockBeenDeducted())->toBeTrue();
});