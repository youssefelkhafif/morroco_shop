<?php

namespace Database\Factories;

use App\Models\DeliveryZone;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 50, 2000);
        $deliveryFee = fake()->randomFloat(2, 0, 100);
        $total = number_format($subtotal + $deliveryFee, 2, '.', '');

        return [
            'order_number' => sprintf(
                'MS-%s-%s',
                now()->format('Ymd'),
                fake()->unique()->numerify('####'),
            ),
            'customer_id' => null,
            'delivery_zone_id' => DeliveryZone::factory(),
            'customer_name' => fake()->name(),
            'customer_phone' => fake()->numerify('06########'),
            'customer_email' => fake()->optional()->safeEmail(),
            'delivery_city' => fake()->city(),
            'delivery_district' => fake()->bothify('District ##'),
            'delivery_zone_name' => 'Standard',
            'delivery_address' => fake()->address(),
            'customer_note' => fake()->optional()->sentence(),
            'payment_method' => Order::PAYMENT_METHOD_CASH_ON_DELIVERY,
            'status' => Order::STATUS_PENDING_WHATSAPP_CONFIRMATION,
            'subtotal_mad' => $subtotal,
            'delivery_fee_mad' => $deliveryFee,
            'total_mad' => $total,
            'cod_amount_mad' => $total,
            'stock_deducted_at' => null,
            'carrier_name' => null,
            'tracking_number' => null,
            'confirmed_at' => null,
            'shipped_at' => null,
            'delivered_at' => null,
            'cancelled_at' => null,
            'no_answer_at' => null,
            'refused_at_delivery_at' => null,
            'returned_at' => null,
        ];
    }
}