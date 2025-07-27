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
        // Schema::table('price_overrides', function (Blueprint $table) {
        //     $table->unsignedBigInteger('company_id')->nullable();
        //     $table->foreign('company_id')->references('company_id')->on('companies')->onDelete('cascade');
        //     $table->unsignedBigInteger('turn_around_time_id')->nullable();
        //     $table->foreign('turn_around_time_id')->references('turn_around_time_id')->on('turn_around_times')->onDelete('cascade');
        //     $table->float('price_override')->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_overrides');
    }
};
