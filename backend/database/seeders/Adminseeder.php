<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Factories\AdminFactory;
use App\Models\Admin;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        Admin::factory()->count(10)->create(); // Adjust count as needed
    }
}
