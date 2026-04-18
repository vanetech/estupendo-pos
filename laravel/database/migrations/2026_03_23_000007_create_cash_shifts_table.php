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
        Schema::create('cash_shifts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cash_register_id')
                ->constrained('cash_registers')
                ->cascadeOnDelete();

            // usuarios
            $table->foreignId('opened_by')
                ->constrained('users');

            $table->foreignId('closed_by')
                ->nullable()
                ->constrained('users');

            // apertura
            $table->decimal('opening_amount', 14, 2);

            $table->timestamp('opened_at');

            // cierre
            $table->timestamp('closed_at')->nullable();

            // montos declarados (lo que cuenta el cajero)
            $table->decimal('amount_cash_declared', 14, 2)->nullable();
            $table->decimal('amount_card_declared', 14, 2)->nullable();
            $table->decimal('amount_transfer_declared', 14, 2)->nullable();

            $table->decimal('closing_amount_declared', 14, 2)->nullable();

            // montos calculados por el sistema
            $table->decimal('amount_cash_calculated', 14, 2)->nullable();
            $table->decimal('amount_card_calculated', 14, 2)->nullable();
            $table->decimal('amount_transfer_calculated', 14, 2)->nullable();

            $table->decimal('closing_amount_calculated', 14, 2)->nullable();

            // diferencia
            $table->decimal('difference', 14, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_shifts');
    }
};
