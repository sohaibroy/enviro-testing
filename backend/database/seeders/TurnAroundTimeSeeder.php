<?php

namespace Database\Seeders;

use App\Models\TurnAroundTime;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TurnAroundTimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        TurnAroundTime::factory()->count(10)->create();
    }
}
