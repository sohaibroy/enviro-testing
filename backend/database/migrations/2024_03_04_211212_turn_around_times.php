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
        Schema::table('turn_around_times', function (Blueprint $table) {
            $table->unsignedBigInteger('turn_around_time_id');
            $table->unsignedBigInteger('method_id')->nullable();
            $table->foreign('method_id')->references('method_id')->on('methods')->onDelete('cascade');
            $table->float('price')->nullable();
            $table->string('turnaround_time')->nullable();
            $table->integer('is_default_price')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turn_around_times');
    }
};
