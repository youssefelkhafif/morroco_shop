<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Shop\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(CartService $cartService): Response
    {
        return Inertia::render('shop/cart/index', [
            'cart' => $cartService->summary(),
        ]);
    }

    public function store(
        Request $request,
        CartService $cartService,
    ): RedirectResponse {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:1000'],
            'color_id' => ['nullable', 'integer', 'exists:product_colors,id'],
        ]);

        $product = Product::query()->findOrFail($data['product_id']);

        $cartService->add(
            $product,
            (int) $data['quantity'],
            $data['color_id'] ?? null,
        );

        return to_route('cart.index')
            ->with('success', 'Product added to cart.');
    }

    public function update(
        Request $request,
        Product $product,
        CartService $cartService,
    ): RedirectResponse {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:1000'],
        ]);

        $cartService->update($product, (int) $data['quantity']);

        return to_route('cart.index');
    }

    public function destroy(
        Product $product,
        CartService $cartService,
    ): RedirectResponse {
        $cartService->remove($product->id);

        return to_route('cart.index');
    }
}