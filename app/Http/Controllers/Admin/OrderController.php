<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Orders\OrderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->withCount('items')
            ->latest()
            ->paginate(20)
            ->through(fn(Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'delivery_city' => $order->delivery_city,
                'delivery_district' => $order->delivery_district,
                'status' => $order->status,
                'total_mad' => $order->total_mad,
                'cod_amount_mad' => $order->cod_amount_mad,
                'items_count' => $order->items_count,
                'created_at' => $order->created_at->toISOString(),
            ]);

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load([
            'customer',
            'deliveryZone',
            'items.product',
        ]);

        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,

                'customer' => [
                    'name' => $order->customer_name,
                    'phone' => $order->customer_phone,
                    'email' => $order->customer_email,
                    'account_id' => $order->customer?->id,
                ],

                'delivery' => [
                    'city' => $order->delivery_city,
                    'district' => $order->delivery_district,
                    'zone_name' => $order->delivery_zone_name,
                    'address' => $order->delivery_address,
                    'estimated_delivery_days' => $order->deliveryZone
                        ?->estimated_delivery_days,
                ],

                'customer_note' => $order->customer_note,
                'payment_method' => $order->payment_method,
                'status' => $order->status,

                'subtotal_mad' => $order->subtotal_mad,
                'delivery_fee_mad' => $order->delivery_fee_mad,
                'total_mad' => $order->total_mad,
                'cod_amount_mad' => $order->cod_amount_mad,

                'carrier_name' => $order->carrier_name,
                'tracking_number' => $order->tracking_number,

                'stock_deducted_at' => $order->stock_deducted_at?->toISOString(),
                'confirmed_at' => $order->confirmed_at?->toISOString(),
                'shipped_at' => $order->shipped_at?->toISOString(),
                'delivered_at' => $order->delivered_at?->toISOString(),

                'created_at' => $order->created_at->toISOString(),

                'items' => $order->items
                    ->map(fn(OrderItem $item) => [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'product_slug' => $item->product_slug,
                        'unit_price_mad' => $item->unit_price_mad,
                        'quantity' => $item->quantity,
                        'line_total_mad' => $item->line_total_mad,
                    ])
                    ->values()
                    ->all(),
            ],
        ]);
    }

    public function transportPdf(Order $order)
    {
        $order->loadMissing([
            'deliveryZone',
            'items',
        ]);

        return Pdf::loadView('admin.orders.transport-pdf', [
            'order' => $order,
        ])
            ->setPaper('a4', 'portrait')
            ->download(
                "transport-order-{$order->order_number}.pdf",
            );
    }

    public function confirm(
        Order $order,
        OrderService $orderService,
    ): RedirectResponse {
        $orderService->confirm($order);

        return to_route('admin.orders.show', $order)
            ->with('success', 'Order confirmed and stock deducted.');
    }
}
