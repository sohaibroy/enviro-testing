<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Schema::table('equipment_details', function (Blueprint $table) {
        //     $table->unsignedBigInteger('serial_id')->autoIncrement();
        //     $table->unsignedBigInteger('equipment_id')->autoIncrement();
        //     $table->foreign('equipment_id')->references('equipment_id')->on('equipment');
        //     $table->string('serial_number', 255);
        //     $table->enum('status', ['available', 'rented', 'maintenance', 'retired'])->default('available');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_details');
    }
};
