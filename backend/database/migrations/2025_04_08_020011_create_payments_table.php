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
        Schema::table('payments', function (Blueprint $table) {
            $table->unsignedBigInteger('payment_id')->autoIncrement();
            $table->unsignedBigInteger('transaction_id')->autoIncrement();
            $table->foreign('transaction_id')->references('transaction_id')->on('transactions');
            $table->string('payment_method', 50);
            $table->string('payment_status', 50);
            $table->string('transaction_reference', 255)->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate();
            $table->string('card_holder_name', 255)->nullable();
            $table->char('card_last_four', 4)->nullable();
            $table->char('card_expiry_month', 2)->nullable();
            $table->char('card_expiry_year', 4)->nullable();
            $table->string('payment_token', 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
