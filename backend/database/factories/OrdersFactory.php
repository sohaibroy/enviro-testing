<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Orders;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Orders>
 */
class OrdersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random test ID from the existing tests
        $customerId = Customer::inRandomOrder()->first()->customer_id;
        return [
            'customer_id' => $customerId,
            'order_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'subtotal' => $this->faker->randomFloat(2, 10, 1000),
            'gst' => $this->faker->randomFloat(2, 1, 100),
            'total_amount' => function (array $attributes) {
                return $attributes['subtotal'] + $attributes['gst'];
            },
        ];
    }
}
