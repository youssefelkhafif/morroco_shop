<?php

use App\Models\DeliveryZone;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\Orders\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function adminOrdersUser(): User
{
    return User::factory()->create([
        'is_admin' => true,
    ]);
}

function adminOrderPayload(
    DeliveryZone $deliveryZone,
    Product $product,
): array {
    return [
        'delivery_zone_id' => $deliveryZone->id,
        'customer_name' => 'Test Customer',
        'customer_phone' => '0612345678',
        'customer_email' => 'customer@example.test',
        'delivery_address' => 'Test address, Casablanca',
        'customer_note' => 'Call before delivery.',
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 2,
            ],
        ],
    ];
}

it('a normal user cannot access admin order management', function () {
    $user = User::factory()->create([
        'is_admin' => false,
    ]);

    $order = Order::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.orders.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->get(route('admin.orders.show', $order))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('admin.orders.confirm', $order))
        ->assertForbidden();
});

it('uses the order policy to allow admins and deny regular users', function () {
    $admin = adminOrdersUser();
    $user = User::factory()->create([
        'is_admin' => false,
    ]);
    $order = Order::factory()->create();

    expect(Gate::forUser($admin)->check('viewAny', Order::class))->toBeTrue()
        ->and(Gate::forUser($admin)->check('view', $order))->toBeTrue()
        ->and(Gate::forUser($admin)->check('confirm', $order))->toBeTrue()
        ->and(Gate::forUser($admin)->check('cancel', $order))->toBeTrue()
        ->and(Gate::forUser($user)->check('viewAny', Order::class))->toBeFalse()
        ->and(Gate::forUser($user)->check('view', $order))->toBeFalse()
        ->and(Gate::forUser($user)->check('confirm', $order))->toBeFalse()
        ->and(Gate::forUser($user)->check('cancel', $order))->toBeFalse();
});

it('an admin can view the order list', function () {
    $order = Order::factory()->create([
        'order_number' => 'MS-20260704-ADMIN1',
        'customer_name' => 'Test Customer',
        'customer_phone' => '0612345678',
        'delivery_city' => 'Casablanca',
        'delivery_district' => 'Anassi',
        'cod_amount_mad' => '250.00',
    ]);

    OrderItem::factory()
        ->for($order)
        ->create();

    $this->actingAs(adminOrdersUser())
        ->get(route('admin.orders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/index')
            ->has('orders.data', 1)
            ->where('orders.data.0.order_number', 'MS-20260704-ADMIN1')
            ->where('orders.data.0.customer_name', 'Test Customer')
            ->where('orders.data.0.delivery_city', 'Casablanca')
            ->where('orders.data.0.items_count', 1)
            ->where('orders.data.0.cod_amount_mad', '250.00'),
        );
});

it('an admin can view order details with item and delivery snapshots', function () {
    $order = Order::factory()->create([
        'customer_name' => 'Youssef',
        'customer_phone' => '0612345678',
        'delivery_city' => 'Casablanca',
        'delivery_district' => 'Anassi',
        'delivery_zone_name' => 'Standard',
        'delivery_address' => '123 Test Street',
        'preparing_at' => now()->subHour(),
        'shipped_at' => now()->subMinute(),
        'delivered_at' => now(),
        'cancelled_at' => null,
    ]);

    OrderItem::factory()
        ->for($order)
        ->create([
            'product_name' => 'Wireless Headphones',
            'quantity' => 2,
            'line_total_mad' => '999.98',
        ]);

    $this->actingAs(adminOrdersUser())
        ->get(route('admin.orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/show')
            ->where('order.order_number', $order->order_number)
            ->where('order.customer.name', 'Youssef')
            ->where('order.delivery.city', 'Casablanca')
            ->where('order.delivery.district', 'Anassi')
            ->where('order.items.0.product_name', 'Wireless Headphones')
            ->where('order.items.0.quantity', 2)
            ->where('order.items.0.line_total_mad', '999.98')
            ->where('order.preparing_at', $order->preparing_at->toISOString())
            ->where('order.shipped_at', $order->shipped_at->toISOString())
            ->where('order.delivered_at', $order->delivered_at->toISOString())
            ->where('order.cancelled_at', null),
        );
});

it('an admin can confirm a pending order through the order management route', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 10,
        'price_mad' => '100.00',
    ]);

    $order = app(OrderService::class)->create(
        adminOrderPayload($deliveryZone, $product),
    );

    $this->actingAs(adminOrdersUser())
        ->post(route('admin.orders.confirm', $order))
        ->assertRedirect(route('admin.orders.show', $order));

    expect($order->fresh()->status)->toBe(Order::STATUS_CONFIRMED)
        ->and($order->fresh()->hasStockBeenDeducted())->toBeTrue()
        ->and($product->fresh()->stock_quantity)->toBe(8);
});

it('an admin can cancel a pending order through the order management route', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 10,
        'price_mad' => '100.00',
    ]);

    $order = app(OrderService::class)->create(
        adminOrderPayload($deliveryZone, $product),
    );

    $this->actingAs(adminOrdersUser())
        ->post(route('admin.orders.cancel', $order))
        ->assertRedirect(route('admin.orders.show', $order));

    expect($order->fresh()->status)->toBe(Order::STATUS_CANCELLED)
        ->and($order->fresh()->cancelled_at)->not->toBeNull()
        ->and($order->fresh()->hasStockBeenDeducted())->toBeFalse()
        ->and($product->fresh()->stock_quantity)->toBe(10);
});

it('an admin can advance an order through the workflow and assign carrier details', function () {
    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 10,
        'price_mad' => '100.00',
    ]);

    $service = app(OrderService::class);

    $order = $service->create(
        adminOrderPayload($deliveryZone, $product),
    );

    $order = $service->confirm($order);

    $this->actingAs(adminOrdersUser())
        ->post(route('admin.orders.assign-carrier-tracking', $order), [
            'carrier_name' => 'Aramex',
            'tracking_number' => 'TRK-123456',
        ])
        ->assertRedirect(route('admin.orders.show', $order));

    $this->actingAs(adminOrdersUser())
        ->post(route('admin.orders.prepare', $order))
        ->assertRedirect(route('admin.orders.show', $order));

    $this->actingAs(adminOrdersUser())
        ->post(route('admin.orders.ship', $order))
        ->assertRedirect(route('admin.orders.show', $order));

    $this->actingAs(adminOrdersUser())
        ->post(route('admin.orders.deliver', $order))
        ->assertRedirect(route('admin.orders.show', $order));

    expect($order->fresh()->status)->toBe(Order::STATUS_DELIVERED)
        ->and($order->fresh()->carrier_name)->toBe('Aramex')
        ->and($order->fresh()->tracking_number)->toBe('TRK-123456')
        ->and($order->fresh()->preparing_at)->not->toBeNull()
        ->and($order->fresh()->shipped_at)->not->toBeNull()
        ->and($order->fresh()->delivered_at)->not->toBeNull();
});