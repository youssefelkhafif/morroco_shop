<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('product_color_id')
                ->nullable()
                ->constrained('product_colors')
                ->nullOnDelete();
            $table->string('product_color_name', 80)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['product_color_id']);
            $table->dropColumn(['product_color_id', 'product_color_name']);
        });
    }
};
