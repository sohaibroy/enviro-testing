<?php

namespace Database\Seeders;

use App\Models\Tests;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Tests::factory()->count(10)->create();
    }
}
