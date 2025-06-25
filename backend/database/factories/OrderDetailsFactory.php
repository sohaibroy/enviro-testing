<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\OrderDetails;
use App\Models\Orders;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderDetails>
 */
class OrderDetailsFactory extends Factory
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
        // Get a random test ID from the existing tests
        $orderId = Orders::inRandomOrder()->first()->order_id;
        return [
            'test_id' => $customerId,
            'order_id' => $orderId,
            'quantity' => $this->faker->numberBetween(1, 10),
        ];
    }
}
