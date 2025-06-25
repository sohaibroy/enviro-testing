<?php

namespace Database\Factories;


use App\Models\Methods;
use App\Models\TurnAroundTime;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TurnAroundTime>
 */
class TurnAroundTimeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        // Get a random test ID from the existing tests
        $methodId = Methods::inRandomOrder()->first()->method_id;
        return [
            'method_id' => $methodId,
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'turnaround_time' => $this->faker->numberBetween(1, 10),
        ];
    }
}
