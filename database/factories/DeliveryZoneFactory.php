<?php

namespace Database\Factories;

use App\Models\DeliveryZone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DeliveryZone>
 */
class DeliveryZoneFactory extends Factory
{
    public function definition(): array
    {
        return [
            'city' => fake()->unique()->city(),
            'district' => fake()->bothify('District ##'),
            'zone_name' => 'Standard',
            'delivery_fee_mad' => fake()->randomFloat(2, 0, 150),
            'estimated_delivery_days' => fake()->optional()->numberBetween(1, 7),
            'is_active' => true,
        ];
    }
}