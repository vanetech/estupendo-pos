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
        Schema::create('cash_movements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cash_shift_id')
                ->constrained('cash_shifts')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();
            
            $table->foreignId('payment_method_id')->nullable();

            $table->enum('type', ['IN', 'OUT']);

            $table->enum('concept', ['VENTA', 'GASTO', 'AJUSTE']);

            $table->unsignedBigInteger('reference_id')->nullable();

            $table->decimal('amount', 12, 2);

            $table->string('description')->nullable();

            $table->timestamps();

            $table->index('cash_shift_id');
            $table->index(['concept']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_movements');
    }
};
