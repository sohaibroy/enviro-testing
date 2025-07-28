<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Schema::create('orders', function (Blueprint $table) {
        //     $table->increments('order_id');
        //     $table->unsignedBigInteger('transaction_id')->nullable();
        //     $table->dateTime('order_date')->nullable();
        //     $table->float('subtotal')->nullable();
        //     $table->double('gst', 8, 2)->nullable();
        //     $table->double('total_amount', 8, 2)->nullable();
        //     $table->tinyInteger('is_active')->default(1);
        //     $table->timestamps();
        //});
    }

    public function down(): void {
        Schema::dropIfExists('orders');
    }
};
