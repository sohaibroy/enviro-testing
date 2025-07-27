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
        // Schema::table('rentals', function (Blueprint $table) {
        //     $table->unsignedBigInteger('rental_id');
        //     $table->unsignedBigInteger('transaction_id');
        //     $table->foreign('transaction_id')->references('transaction_id')->on('transactions')->onDelete('restrict');
        //     $table->dateTime('rental_date');
        //     $table->float('subtotal');
        //     $table->float('gst');
        //     $table->integer('is_complete');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
