<?php

use App\Models\DeliveryZone;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\Orders\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

uses(RefreshDatabase::class);

function orderServicePayload(
    DeliveryZone $deliveryZone,
    array $items,
    array $overrides = [],
): array {
    return array_replace([
        'delivery_zone_id' => $deliveryZone->id,
        'customer_name' => 'Youssef Elkhafif',
        'customer_phone' => '0612345678',
        'customer_email' => 'youssef@example.test',
        'delivery_address' => '123 Rue Exemple, Casablanca',
        'customer_note' => 'Please call before delivery.',
        'items' => $items,
    ], $overrides);
}

it('creates a guest order with Laravel calculated totals and snapshots', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'city' => 'Casablanca',
        'district' => 'Anassi',
        'zone_name' => 'Standard',
        'delivery_fee_mad' => '25.00',
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'name' => 'Wireless Headphones',
        'slug' => 'wireless-headphones',
        'price_mad' => '499.99',
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $order = app(OrderService::class)->create(
        orderServicePayload($deliveryZone, [
            [
                'product_id' => $product->id,
                'quantity' => 2,
            ],
        ]),
    );

    $item = $order->items->first();

    expect($order->customer_id)->toBeNull()
        ->and($order->status)
        ->toBe(Order::STATUS_PENDING_WHATSAPP_CONFIRMATION)
        ->and($order->payment_method)
        ->toBe(Order::PAYMENT_METHOD_CASH_ON_DELIVERY)
        ->and($order->delivery_city)->toBe('Casablanca')
        ->and($order->delivery_district)->toBe('Anassi')
        ->and($order->delivery_zone_name)->toBe('Standard')
        ->and($order->subtotal_mad)->toBe('999.98')
        ->and($order->delivery_fee_mad)->toBe('25.00')
        ->and($order->total_mad)->toBe('1024.98')
        ->and($order->cod_amount_mad)->toBe('1024.98')
        ->and($order->hasStockBeenDeducted())->toBeFalse()
        ->and($order->items)->toHaveCount(1)
        ->and($item->product_id)->toBe($product->id)
        ->and($item->product_name)->toBe('Wireless Headphones')
        ->and($item->product_slug)->toBe('wireless-headphones')
        ->and($item->unit_price_mad)->toBe('499.99')
        ->and($item->quantity)->toBe(2)
        ->and($item->line_total_mad)->toBe('999.98')
        ->and($product->fresh()->stock_quantity)->toBe(10);
});

it('links an authenticated customer and uses their email when none is provided', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'stock_quantity' => 5,
        'is_active' => true,
    ]);

    $customer = User::factory()->create([
        'email' => 'customer@example.test',
    ]);

    $order = app(OrderService::class)->create(
        orderServicePayload(
            $deliveryZone,
            [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ],
            ],
            [
                'customer_email' => null,
            ],
        ),
        $customer,
    );

    expect($order->customer_id)->toBe($customer->id)
        ->and($order->customer_email)->toBe('customer@example.test')
        ->and($order->customer->is($customer))->toBeTrue();
});

it('ignores client prices and merges duplicate products into one order item', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'delivery_fee_mad' => '10.00',
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'price_mad' => '100.00',
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $order = app(OrderService::class)->create(
        orderServicePayload($deliveryZone, [
            [
                'product_id' => $product->id,
                'quantity' => 1,
                'price_mad' => '0.01',
            ],
            [
                'product_id' => $product->id,
                'quantity' => 2,
                'price_mad' => '0.01',
            ],
        ]),
    );

    $item = $order->items->sole();

    expect($order->items)->toHaveCount(1)
        ->and($item->quantity)->toBe(3)
        ->and($item->unit_price_mad)->toBe('100.00')
        ->and($item->line_total_mad)->toBe('300.00')
        ->and($order->subtotal_mad)->toBe('300.00')
        ->and($order->delivery_fee_mad)->toBe('10.00')
        ->and($order->total_mad)->toBe('310.00')
        ->and($order->cod_amount_mad)->toBe('310.00');
});

it('rejects an order without items', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    expect(fn () => app(OrderService::class)->create(
        orderServicePayload($deliveryZone, []),
    ))->toThrow(ValidationException::class);

    expect(Order::count())->toBe(0);
});

it('rejects an inactive delivery zone', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => false,
    ]);

    $product = Product::factory()->create([
        'stock_quantity' => 5,
        'is_active' => true,
    ]);

    expect(fn () => app(OrderService::class)->create(
        orderServicePayload($deliveryZone, [
            [
                'product_id' => $product->id,
                'quantity' => 1,
            ],
        ]),
    ))->toThrow(ValidationException::class);

    expect(Order::count())->toBe(0);
});

it('rejects unavailable or insufficient-stock products without creating an order', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $inactiveProduct = Product::factory()->create([
        'is_active' => false,
        'stock_quantity' => 10,
    ]);

    expect(fn () => app(OrderService::class)->create(
        orderServicePayload($deliveryZone, [
            [
                'product_id' => $inactiveProduct->id,
                'quantity' => 1,
            ],
        ]),
    ))->toThrow(ValidationException::class);

    $lowStockProduct = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 1,
    ]);

    expect(fn () => app(OrderService::class)->create(
        orderServicePayload($deliveryZone, [
            [
                'product_id' => $lowStockProduct->id,
                'quantity' => 2,
            ],
        ]),
    ))->toThrow(ValidationException::class);

    expect(Order::count())->toBe(0)
        ->and($inactiveProduct->fresh()->stock_quantity)->toBe(10)
        ->and($lowStockProduct->fresh()->stock_quantity)->toBe(1);
});

it('confirms an order and deducts stock exactly once', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'stock_quantity' => 8,
        'is_active' => true,
    ]);

    $service = app(OrderService::class);

    $order = $service->create(
        orderServicePayload($deliveryZone, [
            [
                'product_id' => $product->id,
                'quantity' => 3,
            ],
        ]),
    );

    $confirmedOrder = $service->confirm($order);

    expect($confirmedOrder->status)->toBe(Order::STATUS_CONFIRMED)
        ->and($confirmedOrder->confirmed_at)->not->toBeNull()
        ->and($confirmedOrder->stock_deducted_at)->not->toBeNull()
        ->and($confirmedOrder->hasStockBeenDeducted())->toBeTrue()
        ->and($product->fresh()->stock_quantity)->toBe(5);

    $service->confirm($confirmedOrder);

    expect($product->fresh()->stock_quantity)->toBe(5)
        ->and($order->fresh()->status)->toBe(Order::STATUS_CONFIRMED);
});

it('rechecks stock during confirmation and keeps the order pending when stock becomes insufficient', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'stock_quantity' => 5,
        'is_active' => true,
    ]);

    $service = app(OrderService::class);

    $order = $service->create(
        orderServicePayload($deliveryZone, [
            [
                'product_id' => $product->id,
                'quantity' => 4,
            ],
        ]),
    );

    $product->update([
        'stock_quantity' => 2,
    ]);

    expect(fn () => $service->confirm($order))
        ->toThrow(ValidationException::class);

    expect($order->fresh()->status)
        ->toBe(Order::STATUS_PENDING_WHATSAPP_CONFIRMATION)
        ->and($order->fresh()->hasStockBeenDeducted())->toBeFalse()
        ->and($product->fresh()->stock_quantity)->toBe(2);
});

it('does not confirm an order in a non-pending status', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'stock_quantity' => 5,
        'is_active' => true,
    ]);

    $service = app(OrderService::class);

    $order = $service->create(
        orderServicePayload($deliveryZone, [
            [
                'product_id' => $product->id,
                'quantity' => 2,
            ],
        ]),
    );

    $order->update([
        'status' => Order::STATUS_CANCELLED,
    ]);

    expect(fn () => $service->confirm($order))
        ->toThrow(ValidationException::class);

    expect($order->fresh()->status)->toBe(Order::STATUS_CANCELLED)
        ->and($order->fresh()->hasStockBeenDeducted())->toBeFalse()
        ->and($product->fresh()->stock_quantity)->toBe(5);
});