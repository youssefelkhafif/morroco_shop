<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function transportPdfAdmin(): User
{
    return User::factory()->create([
        'is_admin' => true,
    ]);
}

it('a normal user cannot download an order transport pdf', function () {
    $order = Order::factory()->create();

    $user = User::factory()->create([
        'is_admin' => false,
    ]);

    $this->actingAs($user)
        ->get(route('admin.orders.transport-pdf', $order))
        ->assertForbidden();
});

it('an admin can download an order transport pdf', function () {
    $order = Order::factory()->create([
        'order_number' => 'MS-20260704-PDF01',
        'customer_name' => 'Transport Test Customer',
        'customer_phone' => '0612345678',
        'delivery_city' => 'Casablanca',
        'delivery_district' => 'Anassi',
        'delivery_zone_name' => 'Standard',
        'delivery_address' => '123 Test Street',
        'cod_amount_mad' => '325.00',
    ]);

    OrderItem::factory()
        ->for($order)
        ->create([
            'product_name' => 'Wireless Headphones',
            'quantity' => 1,
            'unit_price_mad' => '300.00',
            'line_total_mad' => '300.00',
        ]);

    $response = $this->actingAs(transportPdfAdmin())
        ->get(route('admin.orders.transport-pdf', $order));

    $response->assertOk();

    expect($response->headers->get('content-type'))
        ->toContain('application/pdf');

    expect($response->headers->get('content-disposition'))
        ->toContain(
            "transport-order-{$order->order_number}.pdf",
        );
});