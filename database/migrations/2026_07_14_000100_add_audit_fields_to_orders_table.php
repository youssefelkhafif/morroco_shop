<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'confirmed_by')) {
                $table->foreignId('confirmed_by')->nullable()->constrained('users')->nullOnDelete();
            }

            if (! Schema::hasColumn('orders', 'cancelled_by')) {
                $table->foreignId('cancelled_by')->nullable()->constrained('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'confirmed_by')) {
                $table->dropConstrainedForeignId('confirmed_by');
            }

            if (Schema::hasColumn('orders', 'cancelled_by')) {
                $table->dropConstrainedForeignId('cancelled_by');
            }
        });
    }
};
