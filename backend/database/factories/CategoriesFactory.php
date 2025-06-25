<?php

namespace Database\Factories;


use App\Models\Categories;
use App\Models\Analytes;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Categories>
 */
class CategoriesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

    // Get a random test ID from the existing tests
    $testId = Analytes::inRandomOrder()->first()->analyte_id;
        return [
            'analyte_id'=>$testId,
            'category_id' => $this->faker->numberBetween(1, 10),
            'category_name' => $this->faker->word,
            'technique' => $this->faker->word,
        ];
    }
}
