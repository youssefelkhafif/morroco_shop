<?php

use App\Models\DeliveryZone;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\OrderConfirmedNotification;
use App\Services\Orders\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('creates a notification when an admin confirms a customer order', function () {
    $customer = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $admin = User::factory()->create([
        'is_admin' => true,
        'email_verified_at' => now(),
    ]);

    $deliveryZone = DeliveryZone::factory()->create([
        'is_active' => true,
    ]);

    $product = Product::factory()->create([
        'is_active' => true,
        'stock_quantity' => 10,
        'price_mad' => '100.00',
    ]);

    $order = app(OrderService::class)->create([
        'delivery_zone_id' => $deliveryZone->id,
        'customer_name' => 'Customer Notification',
        'customer_phone' => '0612345678',
        'customer_email' => 'notification@example.test',
        'delivery_address' => '123 Test Street',
        'customer_note' => 'Notify me.',
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 1,
            ],
        ],
    ], $customer);

    $this->actingAs($admin)
        ->post(route('admin.orders.confirm', $order))
        ->assertRedirect(route('admin.orders.show', $order));

    expect($customer->fresh()->unreadNotifications()->count())->toBe(1);

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('notifications.unread_count', 1)
            ->has('notifications.latest.0.message')
            ->has('notifications.latest.0.whatsapp_url')
        );
});
