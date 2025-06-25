<?php

namespace Database\Seeders;

use App\Models\Methods;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MethodsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Methods::factory()->count(10)->create();
    }
}
