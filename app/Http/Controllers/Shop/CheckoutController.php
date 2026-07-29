<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\StoreCheckoutRequest;
use App\Models\DeliveryZone;
use App\Services\Orders\OrderService;
use App\Services\Shop\CartService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(CartService $cartService): Response|RedirectResponse
    {
        $cart = $cartService->summary();

        if ($cart['items'] === []) {
            return to_route('cart.index')
                ->with('error', 'Your cart is empty.');
        }

        $deliveryZones = DeliveryZone::query()
            ->where('is_active', true)
            ->orderBy('city')
            ->orderBy('district')
            ->orderBy('zone_name')
            ->get()
            ->map(fn (DeliveryZone $zone) => [
                'id' => $zone->id,
                'city' => $zone->city,
                'district' => $zone->district,
                'zone_name' => $zone->zone_name,
                'delivery_fee_mad' => $zone->delivery_fee_mad,
                'estimated_delivery_days' => $zone->estimated_delivery_days,
            ])
            ->values()
            ->all();

        return Inertia::render('shop/checkout/index', [
            'cart' => $cart,
            'delivery_zones' => $deliveryZones,
        ]);
    }

    public function store(
        StoreCheckoutRequest $request,
        CartService $cartService,
        OrderService $orderService,
    ) {
        $cart = $cartService->summary();
        $cartItems = $cartService->orderItems();

        if ($cartItems === []) {
            return to_route('cart.index')
                ->with('error', 'Your cart is empty.');
        }

        $order = $orderService->create(
            [
                ...$request->validated(),
                'items' => $cartItems,
            ],
            $request->user(),
        );

        $cartService->clear();

        $deliveryZones = DeliveryZone::query()
            ->where('is_active', true)
            ->orderBy('city')
            ->orderBy('district')
            ->orderBy('zone_name')
            ->get()
            ->map(fn (DeliveryZone $zone) => [
                'id' => $zone->id,
                'city' => $zone->city,
                'district' => $zone->district,
                'zone_name' => $zone->zone_name,
                'delivery_fee_mad' => $zone->delivery_fee_mad,
                'estimated_delivery_days' => $zone->estimated_delivery_days,
            ])
            ->values()
            ->all();

        return Inertia::render('shop/checkout/index', [
            'cart' => $cart,
            'delivery_zones' => $deliveryZones,
            'orderPlaced' => true,
            'orderNumber' => $order->order_number,
            'success' => 'Your order has been received. Admin will confirm it soon.',
        ]);
    }
}