<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('order_equipment', function (Blueprint $table) {
            $table->id(); // Primary key for order_equipment
            $table->unsignedInteger('order_id'); // Must match orders.order_id type
            $table->string('equipment_name');
            $table->string('category');
            $table->date('start_date');
            $table->date('return_date');
            $table->integer('quantity');
            $table->decimal('daily_cost', 8, 2);
            $table->timestamps();

            $table->foreign('order_id')
                  ->references('order_id')
                  ->on('orders')
                  ->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('order_equipment');
    }
};