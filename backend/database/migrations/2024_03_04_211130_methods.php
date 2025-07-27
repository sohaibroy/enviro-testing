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
        // Schema::table('methods', function (Blueprint $table) {
        //     $table->unsignedBigInteger('method_id');
        //     $table->unsignedBigInteger('analyte_id')->nullable();
        //     $table->foreign('analyte_id')->references('analyte_id')->on('analytes')->onDelete('cascade');
        //     $table->string('method_name')->nullable();
        //     $table->string('matrix')->nullable();
        //     $table->string('media')->nullable();
        //     $table->string('measurement')->nullable();
        //     $table->string('sample_rate')->nullable();
        //     $table->string('limit_of_quantification')->nullable();
        //     $table->string('general_comments')->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('methods');
    }
};
