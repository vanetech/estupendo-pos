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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();

            $table->foreignId('business_id')
                ->constrained('business')
                ->cascadeOnDelete();

            $table->string('name');

            $table->enum('document_type', ['CC','NIT','CE','PAS','TI','PT'])->nullable();
            $table->string('document_number')->nullable()->index();  // cédula o NIT
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();

            $table->boolean('active')->default(true);

            $table->timestamps();

            $table->index(['business_id', 'name']);
            $table->unique(['business_id', 'document_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
