<?php

namespace App\Services\Orders;

use App\Models\DeliveryZone;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class OrderService
{
    public function create(array $payload, ?User $customer = null): Order
    {
        return DB::transaction(function () use ($payload, $customer) {
            $deliveryZone = DeliveryZone::query()
                ->whereKey($payload['delivery_zone_id'] ?? null)
                ->where('is_active', true)
                ->first();

            if (! $deliveryZone) {
                throw ValidationException::withMessages([
                    'delivery_zone_id' => 'The selected delivery zone is not available.',
                ]);
            }

            $items = $this->normalizeItems($payload['items'] ?? []);

            $productIds = array_column($items, 'product_id');

            $products = Product::query()
                ->whereIn('id', $productIds)
                ->get()
                ->keyBy('id');

            if ($products->count() !== count($items)) {
                throw ValidationException::withMessages([
                    'items' => 'One or more selected products no longer exist.',
                ]);
            }

            $orderItems = [];
            $subtotalCents = 0;

            foreach ($items as $item) {
                $product = $products->get($item['product_id']);

                if (! $product || ! $product->is_active) {
                    throw ValidationException::withMessages([
                        'items' => "The product \"{$product?->name}\" is not available.",
                    ]);
                }

                if ($product->stock_quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock for \"{$product->name}\".",
                    ]);
                }

                $unitPriceCents = $this->moneyToCents($product->price_mad);
                $lineTotalCents = $unitPriceCents * $item['quantity'];

                $subtotalCents += $lineTotalCents;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_slug' => $product->slug,
                    'unit_price_mad' => $this->centsToMoney($unitPriceCents),
                    'quantity' => $item['quantity'],
                    'line_total_mad' => $this->centsToMoney($lineTotalCents),
                ];
            }

            $deliveryFeeCents = $this->moneyToCents(
                $deliveryZone->delivery_fee_mad,
            );

            $totalCents = $subtotalCents + $deliveryFeeCents;

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'customer_id' => $customer?->id,
                'delivery_zone_id' => $deliveryZone->id,

                'customer_name' => trim((string) ($payload['customer_name'] ?? '')),
                'customer_phone' => trim((string) ($payload['customer_phone'] ?? '')),
                'customer_email' => $payload['customer_email']
                    ?? $customer?->email,

                'delivery_city' => $deliveryZone->city,
                'delivery_district' => $deliveryZone->district,
                'delivery_zone_name' => $deliveryZone->zone_name,
                'delivery_address' => trim(
                    (string) ($payload['delivery_address'] ?? ''),
                ),
                'customer_note' => $this->nullableTrimmedValue(
                    $payload['customer_note'] ?? null,
                ),

                'payment_method' => Order::PAYMENT_METHOD_CASH_ON_DELIVERY,
                'status' => Order::STATUS_PENDING_WHATSAPP_CONFIRMATION,

                'subtotal_mad' => $this->centsToMoney($subtotalCents),
                'delivery_fee_mad' => $this->centsToMoney($deliveryFeeCents),
                'total_mad' => $this->centsToMoney($totalCents),
                'cod_amount_mad' => $this->centsToMoney($totalCents),
            ]);

            $order->items()->createMany($orderItems);

            return $order->load([
                'items',
                'deliveryZone',
                'customer',
            ]);
        });
    }

    public function confirm(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            $order = Order::query()
                ->with('items')
                ->lockForUpdate()
                ->findOrFail($order->id);

            if ($order->hasStockBeenDeducted()) {
                return $order->fresh([
                    'items',
                    'deliveryZone',
                    'customer',
                ]);
            }

            if (
                $order->status
                !== Order::STATUS_PENDING_WHATSAPP_CONFIRMATION
            ) {
                throw ValidationException::withMessages([
                    'status' => 'Only pending WhatsApp orders can be confirmed.',
                ]);
            }

            $requiredQuantities = $order->items
                ->groupBy('product_id')
                ->map(fn ($items) => $items->sum('quantity'));

            if ($requiredQuantities->has(null)) {
                throw ValidationException::withMessages([
                    'items' => 'A product from this order is no longer available.',
                ]);
            }

            $products = Product::query()
                ->whereIn('id', $requiredQuantities->keys()->all())
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($requiredQuantities as $productId => $quantity) {
                $product = $products->get($productId);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => 'A product from this order no longer exists.',
                    ]);
                }

                if ($product->stock_quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock for \"{$product->name}\".",
                    ]);
                }
            }

            foreach ($requiredQuantities as $productId => $quantity) {
                $products->get($productId)->decrement(
                    'stock_quantity',
                    $quantity,
                );
            }

            $order->forceFill([
                'status' => Order::STATUS_CONFIRMED,
                'confirmed_at' => now(),
                'stock_deducted_at' => now(),
            ])->save();

            return $order->fresh([
                'items',
                'deliveryZone',
                'customer',
            ]);
        });
    }

    private function normalizeItems(array $items): array
    {
        if ($items === []) {
            throw ValidationException::withMessages([
                'items' => 'At least one product is required.',
            ]);
        }

        $quantities = [];

        foreach (array_values($items) as $index => $item) {
            $productId = filter_var(
                $item['product_id'] ?? null,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1]],
            );

            $quantity = filter_var(
                $item['quantity'] ?? null,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1]],
            );

            if ($productId === false || $quantity === false) {
                throw ValidationException::withMessages([
                    "items.{$index}" => 'Each item needs a valid product and quantity.',
                ]);
            }

            $quantities[$productId] = ($quantities[$productId] ?? 0)
                + $quantity;
        }

        return collect($quantities)
            ->map(
                fn (int $quantity, int $productId) => [
                    'product_id' => $productId,
                    'quantity' => $quantity,
                ],
            )
            ->values()
            ->all();
    }

    private function generateOrderNumber(): string
    {
        for ($attempt = 0; $attempt < 10; $attempt++) {
            $orderNumber = sprintf(
                'MS-%s-%s',
                now()->format('Ymd'),
                Str::upper(Str::random(7)),
            );

            if (! Order::query()
                ->where('order_number', $orderNumber)
                ->exists()) {
                return $orderNumber;
            }
        }

        throw new RuntimeException('Unable to generate a unique order number.');
    }

    private function moneyToCents(string|int|float $amount): int
    {
        $amount = trim((string) $amount);

        if (! preg_match('/^\d+(?:\.\d{1,2})?$/', $amount)) {
            throw new RuntimeException('Invalid money amount.');
        }

        [$whole, $fraction] = array_pad(
            explode('.', $amount, 2),
            2,
            '',
        );

        return ((int) $whole * 100)
            + (int) str_pad($fraction, 2, '0');
    }

    private function centsToMoney(int $cents): string
    {
        return number_format($cents / 100, 2, '.', '');
    }

    private function nullableTrimmedValue(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}