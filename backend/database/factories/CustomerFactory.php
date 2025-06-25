<?php

namespace Database\Factories;

// use Illuminate\Database\Eloquent\Factories\Factory;

// /**
//  * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\customers>
//  */
// class CustomerFactory extends Factory
// {
//     /**
//      * Define the model's default state.
//      *
//      * @return array<string, mixed>
//      */
//     public function definition(): array
//     {
//         return [
//             //
//         ];
//     }
// }
namespace Database\Factories;

use App\Models\Accounts;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Accounts::class;

    // public function definition()
    // {
    //     return [
    //         'first_name' => $this->faker->firstName,
    //         'last_name' => $this->faker->lastName,
    //         'email' => $this->faker->unique()->safeEmail,
    //         'password' => bcrypt('password'), // Example of setting a default password
    //         'company_name' => $this->faker->company,
    //         'phone' => $this->faker->phoneNumber,
    //         'address' => $this->faker->address,
    //     ];
    // }
}

