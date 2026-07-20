<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductColor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductColor>
 */
class ProductColorFactory extends Factory
{
    protected $model = ProductColor::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => $this->faker->randomElement(['Black', 'White', 'Beige', 'Forest']),
            'hex_code' => $this->faker->hexColor(),
            'sort_order' => 0,
        ];
    }
}
