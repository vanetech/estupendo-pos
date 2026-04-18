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
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();

            $table->foreignId('business_id')
                ->constrained('business')
                ->cascadeOnDelete();

            $table->string('name'); // Efectivo, Tarjeta, Nequi
            $table->string('code')->nullable(); // CASH, CARD, NEQUI

            $table->boolean('active')->default(true);

            $table->timestamps();

            $table->unique(['business_id', 'name']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
