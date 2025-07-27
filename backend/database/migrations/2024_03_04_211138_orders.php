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
        // Schema::table('orders', function (Blueprint $table) {
        //     $table->unsignedBigInteger('order_id');
        //     $table->unsignedBigInteger('account_id')->nullable();
        //     $table->foreign('account_id')->references('account_id')->on('accounts')->onDelete('cascade');
        //     $table->dateTime('order_date')->nullable();
        //     $table->float('total_amount')->nullable();
        //     $table->float('subtotal')->nullable();
        //     $table->float('gst')->nullable();
        //     $table->integer('is_processed')->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
