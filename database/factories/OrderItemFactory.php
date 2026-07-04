<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 4);
        $unitPrice = fake()->randomFloat(2, 10, 2000);
        $productName = fake()->words(3, true);

        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_name' => $productName,
            'product_slug' => Str::slug($productName),
            'unit_price_mad' => $unitPrice,
            'quantity' => $quantity,
            'line_total_mad' => number_format(
                $unitPrice * $quantity,
                2,
                '.',
                '',
            ),
        ];
    }
}