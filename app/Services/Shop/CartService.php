<?php

namespace App\Services\Shop;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class CartService
{
    private const SESSION_KEY = 'morocco_shop.cart';

    public function add(Product $product, int $quantity): void
    {
        $cart = $this->normalizedCart($this->rawCart());

        $newQuantity = ($cart[$product->id] ?? 0) + $quantity;

        $this->ensureProductCanBePurchased($product, $newQuantity);

        $cart[$product->id] = $newQuantity;

        $this->persistCart($cart);
    }

    public function update(Product $product, int $quantity): void
    {
        if ($quantity === 0) {
            $this->remove($product->id);

            return;
        }

        $this->ensureProductCanBePurchased($product, $quantity);

        $cart = $this->normalizedCart($this->rawCart());

        $cart[$product->id] = $quantity;

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
            ->with('images')
            ->get()
            ->keyBy('id');

        $items = [];
        $validCart = [];
        $subtotalCents = 0;

        foreach ($cart as $productId => $quantity) {
            $product = $products->get($productId);

            if (! $product || $product->stock_quantity < 1) {
                continue;
            }

            $safeQuantity = min($quantity, $product->stock_quantity);

            $validCart[$product->id] = $safeQuantity;

            $unitPriceCents = $this->moneyToCents($product->price_mad);
            $lineTotalCents = $unitPriceCents * $safeQuantity;

            $subtotalCents += $lineTotalCents;

            $firstImage = $product->images->first();

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
            ];
        }

        if ($validCart !== $rawCart) {
            $this->persistCart($validCart);
        }

        return [
            'items' => $items,
            'item_count' => array_sum($validCart),
            'subtotal_mad' => $this->centsToMoney($subtotalCents),
        ];
    }

    public function orderItems(): array
    {
        return collect($this->summary()['items'])
            ->map(fn (array $item) => [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
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

        foreach ($cart as $productId => $quantity) {
            $productId = filter_var(
                $productId,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1]],
            );

            $quantity = filter_var(
                $quantity,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1]],
            );

            if ($productId === false || $quantity === false) {
                continue;
            }

            $normalized[(int) $productId] = (int) $quantity;
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