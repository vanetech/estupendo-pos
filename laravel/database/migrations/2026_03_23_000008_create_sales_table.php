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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();

            // multinegocio
            $table->foreignId('business_id')
                ->constrained('business')
                ->cascadeOnDelete();

            // caja
            $table->foreignId('cash_register_id')
                ->constrained('cash_registers');

            // turno de caja
            $table->foreignId('cash_shift_id')
                ->constrained('cash_shifts');

            // cliente (puede ser opcional)
            $table->foreignId('client_id')
                ->nullable()
                ->constrained('clients');

            // montos
            $table->decimal('total_amount', 14, 2);
            $table->decimal('discount', 14, 2)->default(0);
            $table->decimal('tax_amount', 14, 2)->default(0);

            // factura
            $table->string('invoice_number')->nullable();

            // estado
            $table->string('status')->default('PAID');
            // PAID | CANCELLED | PENDING

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
