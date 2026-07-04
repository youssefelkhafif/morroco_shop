<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->constrained()
                ->cascadeOnDelete();

            /*
             * Nullable for historical safety:
             * an old order remains valid even if its product is later deleted.
             */
            $table->foreignId('product_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Product snapshots at the exact time of ordering.
            $table->string('product_name', 180);
            $table->string('product_slug', 180);
            $table->decimal('unit_price_mad', 10, 2);
            $table->unsignedInteger('quantity');
            $table->decimal('line_total_mad', 10, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};