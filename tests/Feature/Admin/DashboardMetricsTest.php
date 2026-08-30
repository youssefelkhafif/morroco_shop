<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('loads real admin dashboard metrics and chart data from the database', function () {
    $caps = Category::factory()->create([
        'name' => 'Caps',
        'is_active' => true,
    ]);

    $beanies = Category::factory()->create([
        'name' => 'Beanies',
        'is_active' => true,
    ]);

    Product::factory()->count(3)->create([
        'category_id' => $caps->id,
        'is_active' => true,
        'stock_quantity' => 12,
    ]);

    Product::factory()->create([
        'category_id' => $beanies->id,
        'is_active' => true,
        'stock_quantity' => 5,
    ]);

    Product::factory()->create([
        'category_id' => $caps->id,
        'is_active' => false,
        'stock_quantity' => 2,
    ]);

    $customer = User::factory()->create([
        'is_admin' => false,
    ]);

    Order::factory()->create([
        'customer_id' => $customer->id,
        'status' => Order::STATUS_DELIVERED,
        'total_mad' => 1200,
        'created_at' => now()->subMonth(),
    ]);

    Order::factory()->create([
        'customer_id' => $customer->id,
        'status' => Order::STATUS_DELIVERED,
        'total_mad' => 800,
        'created_at' => now()->subDays(12),
    ]);

    Order::factory()->create([
        'customer_id' => $customer->id,
        'status' => Order::STATUS_PENDING_WHATSAPP_CONFIRMATION,
        'total_mad' => 500,
        'created_at' => now()->subDays(3),
    ]);

    $this->actingAs(adminOrdersUser())
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.stock_remaining', 41)
            ->where('stats.low_stock_count', 1)
            ->where('stats.total_orders', 3)
            ->where('stats.completed_orders', 2)
            ->where('stats.total_customers', 1)
            ->where('stats.sales_volume', 2000)
            ->where('stats.active_categories', 2)
            ->where('stats.active_products', 4)
            ->where('salesTrend.0.sales', 1200)
            ->where('categoryDistribution.0.name', 'Caps')
            ->where('categoryDistribution.0.value', 3)
        );
});
