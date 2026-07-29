<?php

namespace App\Services\Shop;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class CartService
{
    private const SESSION_KEY = 'morocco_shop.cart';

    public function add(Product $product, int $quantity, ?int $colorId = null): void
    {
        $cart = $this->normalizedCart($this->rawCart());

        $item = $cart[$product->id] ?? ['quantity' => 0, 'color_id' => null];
        $newQuantity = $item['quantity'] + $quantity;

        $this->ensureProductCanBePurchased($product, $newQuantity);

        if ($colorId !== null) {
            $item['color_id'] = $colorId;
        }

        $item['quantity'] = $newQuantity;
        $cart[$product->id] = $item;

        $this->persistCart($cart);
    }

    public function update(Product $product, int $quantity, ?int $colorId = null): void
    {
        if ($quantity === 0) {
            $this->remove($product->id);

            return;
        }

        $this->ensureProductCanBePurchased($product, $quantity);

        $cart = $this->normalizedCart($this->rawCart());

        $item = $cart[$product->id] ?? ['quantity' => 0, 'color_id' => null];

        if ($colorId !== null) {
            $item['color_id'] = $colorId;
        }

        $item['quantity'] = $quantity;
        $cart[$product->id] = $item;

        $this->persistCart($cart);
    }

    public function remove(int $productId): void
    {
        $cart = $this->normalizedCart($this->rawCart());

        unset($cart[$productId]);

        $this->persistCart($cart);
    }

    public function clear(): void
    {
        session()->forget(self::SESSION_KEY);
    }

    public function summary(): array
    {
        $rawCart = $this->rawCart();
        $cart = $this->normalizedCart($rawCart);

        if ($cart === []) {
            return $this->emptySummary();
        }

        $products = Product::query()
            ->whereIn('id', array_keys($cart))
            ->where('is_active', true)
            ->with(['images', 'colors'])
            ->get()
            ->keyBy('id');

        $items = [];
        $validCart = [];
        $subtotalCents = 0;

        foreach ($cart as $productId => $item) {
            $product = $products->get($productId);

            if (! $product || $product->stock_quantity < 1) {
                continue;
            }

            $safeQuantity = min($item['quantity'], $product->stock_quantity);
            $validCart[$product->id] = [
                'quantity' => $safeQuantity,
                'color_id' => $item['color_id'] ?? null,
            ];

            $unitPriceCents = $this->moneyToCents($product->price_mad);
            $lineTotalCents = $unitPriceCents * $safeQuantity;

            $subtotalCents += $lineTotalCents;

            $firstImage = $product->images->first();
            $selectedColor = null;

            if (! empty($item['color_id'])) {
                $selectedColor = $product->colors->firstWhere(
                    'id',
                    $item['color_id'],
                );
            }

            if (! $selectedColor) {
                $selectedColor = $product->colors->first();
            }

            $items[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price_mad' => $this->centsToMoney($unitPriceCents),
                'quantity' => $safeQuantity,
                'line_total_mad' => $this->centsToMoney($lineTotalCents),
                'stock_quantity' => $product->stock_quantity,
                'image_url' => $firstImage
                    ? Storage::disk('public')->url($firstImage->path)
                    : null,
                'color_id' => $selectedColor?->id,
                'color_name' => $selectedColor?->name,
                'color_hex' => $selectedColor?->hex_code,
            ];
        }

        if ($validCart !== $rawCart) {
            $this->persistCart($validCart);
        }

        return [
            'items' => $items,
            'item_count' => array_sum(array_column($validCart, 'quantity')),
            'subtotal_mad' => $this->centsToMoney($subtotalCents),
        ];
    }

    public function orderItems(): array
    {
        return collect($this->summary()['items'])
            ->map(fn (array $item) => [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'color_id' => $item['color_id'] ?? null,
                'color_name' => $item['color_name'] ?? null,
                'color_hex' => $item['color_hex'] ?? null,
            ])
            ->all();
    }

    private function ensureProductCanBePurchased(
        Product $product,
        int $quantity,
    ): void {
        if (! $product->is_active || $product->stock_quantity < 1) {
            throw ValidationException::withMessages([
                'product_id' => 'This product is no longer available.',
            ]);
        }

        if ($quantity > $product->stock_quantity) {
            throw ValidationException::withMessages([
                'quantity' => "Only {$product->stock_quantity} item(s) are available for \"{$product->name}\".",
            ]);
        }
    }

    private function rawCart(): array
    {
        $cart = session()->get(self::SESSION_KEY, []);

        return is_array($cart) ? $cart : [];
    }

    private function normalizedCart(array $cart): array
    {
        $normalized = [];

        foreach ($cart as $productId => $value) {
            $productId = filter_var(
                $productId,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1]],
            );

            if ($productId === false) {
                continue;
            }

            $quantity = null;
            $colorId = null;

            if (is_array($value)) {
                $quantity = filter_var(
                    $value['quantity'] ?? null,
                    FILTER_VALIDATE_INT,
                    ['options' => ['min_range' => 1]],
                );

                $colorId = isset($value['color_id'])
                    ? filter_var(
                        $value['color_id'],
                        FILTER_VALIDATE_INT,
                        ['options' => ['min_range' => 1]],
                    )
                    : null;
            } else {
                $quantity = filter_var(
                    $value,
                    FILTER_VALIDATE_INT,
                    ['options' => ['min_range' => 1]],
                );
            }

            if ($quantity === false || $quantity === null) {
                continue;
            }

            $normalized[(int) $productId] = [
                'quantity' => (int) $quantity,
                'color_id' => $colorId,
            ];
        }

        return $normalized;
    }

    private function persistCart(array $cart): void
    {
        if ($cart === []) {
            session()->forget(self::SESSION_KEY);

            return;
        }

        session()->put(self::SESSION_KEY, $cart);
    }

    private function emptySummary(): array
    {
        return [
            'items' => [],
            'item_count' => 0,
            'subtotal_mad' => '0.00',
        ];
    }

    private function moneyToCents(string|int|float $amount): int
    {
        $amount = trim((string) $amount);

        if (! preg_match('/^\d+(?:\.\d{1,2})?$/', $amount)) {
            throw new RuntimeException('Invalid product price.');
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
}