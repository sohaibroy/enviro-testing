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
        // Schema::table('transactions', function (Blueprint $table) {
        //     $table->unsignedBigInteger('transaction_id')->autoIncrement();
        //     $table->unsignedBigInteger('account_id');
        //     $table->foreign('account_id')->references('account_id')->on('accounts');
        //     $table->timestamp('transaction_date');
        //     $table->decimal('total_amount', 10, 2);
        //     $table->decimal('subtotal', 10, 2);
        //     $table->decimal('gst', 10, 2);
        //     $table->string('status')->default('pending');
        //     $table->tinyInteger('is_active')->default(1);
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
