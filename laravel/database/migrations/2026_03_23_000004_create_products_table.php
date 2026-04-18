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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('business_id')
                ->constrained('business')
                ->cascadeOnDelete();

            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 14, 2);
            $table->decimal('cost', 14, 2)->nullable();
            $table->string('sku')->nullable(); // código interno
            $table->string('barcode')->nullable();
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->nullable();
            $table->boolean('active')->default(true);
            
            $table->timestamps();

            $table->index(['business_id', 'name']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
