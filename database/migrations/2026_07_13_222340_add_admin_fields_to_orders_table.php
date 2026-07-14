<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {

            if (!Schema::hasColumn('orders', 'status')) {
                $table->string('status')
                    ->default('pending_whatsapp_confirmation');
            }

            if (!Schema::hasColumn('orders', 'confirmed_at')) {
                $table->timestamp('confirmed_at')->nullable();
            }

            if (!Schema::hasColumn('orders', 'confirmed_by')) {
                $table->foreignId('confirmed_by')
                    ->nullable()
                    ->constrained('users')
                    ->nullOnDelete();
            }

        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {

            $table->dropConstrainedForeignId('confirmed_by');
            $table->dropColumn([
                'status',
                'confirmed_at',
            ]);

        });
    }
};