<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->string('order_number', 50)->unique();

            // Optional: present only when a logged-in customer creates the order.
            $table->foreignId('customer_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
             * Checkout will require an active delivery zone.
             * It remains nullable only for historical safety if an admin later
             * deletes a delivery-zone configuration.
             */
            $table->foreignId('delivery_zone_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Customer and delivery snapshots.
            $table->string('customer_name', 120);
            $table->string('customer_phone', 40);
            $table->string('customer_email', 190)->nullable();

            $table->string('delivery_city', 120);
            $table->string('delivery_district', 120);
            $table->string('delivery_zone_name', 120);
            $table->text('delivery_address');
            $table->text('customer_note')->nullable();

            // Morocco Shop supports COD only.
            $table->string('payment_method', 50)
                ->default('cash_on_delivery');

            $table->string('status', 50)
                ->default('pending_whatsapp_confirmation')
                ->index();

            // All amounts are calculated by Laravel, never trusted from React.
            $table->decimal('subtotal_mad', 10, 2);
            $table->decimal('delivery_fee_mad', 10, 2);
            $table->decimal('total_mad', 10, 2);
            $table->decimal('cod_amount_mad', 10, 2);

            /*
             * This timestamp is the idempotency lock for inventory:
             * stock is deducted only once when the order becomes confirmed.
             */
            $table->timestamp('stock_deducted_at')->nullable();

            $table->string('carrier_name', 120)->nullable();
            $table->string('tracking_number', 120)->nullable();

            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('no_answer_at')->nullable();
            $table->timestamp('refused_at_delivery_at')->nullable();
            $table->timestamp('returned_at')->nullable();

            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};