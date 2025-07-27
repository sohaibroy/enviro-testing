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
        // Schema::table('companies', function (Blueprint $table) {
        //     $table->unsignedBigInteger('company_id');
        //     $table->string('company_name')->nullable();
        //     $table->string('company_phone')->nullable();
        //     $table->string('address')->nullable();
        //     $table->integer('is_active')->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
