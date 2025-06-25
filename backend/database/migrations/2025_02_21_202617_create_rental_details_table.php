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
        Schema::table('rental_details', function (Blueprint $table) {
            $table->unsignedBigInteger('rental_id');
            $table->unsignedBigInteger('serial_id');
            $table->foreign('serial_id')->references('serial_id')->on('equipment_details');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->dateTime('return_date')->nullable();
            $table->integer('quantity');
            $table->float('price');
            $table->string('equipment_condition')->nullable();
            $table->boolean('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_details');
    }
};
