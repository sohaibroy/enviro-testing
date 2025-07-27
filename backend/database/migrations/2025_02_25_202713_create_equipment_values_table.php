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
        // Schema::table('equipment_values', function (Blueprint $table) {
        //     $table->unsignedBigInteger('equipment_id');
        //     $table->foreign('equipment_id')->references('equipment_id')->on('equipment')->onDelete('cascade');
        //     $table->unsignedBigInteger('attribute_id');
        //     $table->foreign('attribute_id')->references('attribute_id')->on('equipment_attributes')->onDelete('cascade');
        //     $table->string('attribute_value')->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_values');
    }
};
