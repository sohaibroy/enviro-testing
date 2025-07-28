<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 
    // public function up(): void
    // {
    //    Schema::create('order_details', function (Blueprint $table) {
    // $table->id();

    // $table->unsignedBigInteger('order_id');
    // $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');

    // $table->unsignedBigInteger('turn_around_id')->nullable();
    // $table->foreign('turn_around_id')->references('turn_around_id')->on('turn_around_times')->onDelete('set null');

    // $table->decimal('price', 8, 2);
    // $table->integer('required_quantity')->default(1);
    // $table->integer('required_pumps')->nullable();
    // $table->string('required_media')->nullable();
    // $table->text('customer_comment')->nullable();

    // $table->timestamps();
//});
    //}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
