<?php

namespace Database\Factories;

use App\Models\Methods;
use App\Models\Tests;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Methods>
 */
class MethodsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         // Get a random test ID from the existing tests
         $testId = Tests::inRandomOrder()->first()->test_id;
        return [
            'test_id' => $testId,
            'method_name' => $this->faker->word,
            'matrix' => $this->faker->word,
            'media'=>$this->faker->word,
            'measurement' => $this->faker->word,
            'sample_rate' => $this->faker->randomFloat(2, 0, 100),
            'limit_of_quantification' => $this->faker->randomFloat(2, 0, 100),
            'general_comments' => $this->faker->sentence,
        ];
    }
}
