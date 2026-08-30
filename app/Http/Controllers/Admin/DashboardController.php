<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $activeProductsQuery = Product::query()->where('is_active', true);

        $stats = [
            'stock_remaining' => (float) ($activeProductsQuery->sum('stock_quantity') ?? 0),
            'low_stock_count' => (clone $activeProductsQuery)
                ->where('stock_quantity', '<=', 5)
                ->count(),
            'total_orders' => Order::query()->count(),
            'completed_orders' => Order::query()
                ->where('status', Order::STATUS_DELIVERED)
                ->count(),
            'total_customers' => Order::query()
                ->whereNotNull('customer_id')
                ->distinct('customer_id')
                ->count('customer_id'),
            'active_categories' => Category::query()->where('is_active', true)->count(),
            'active_products' => $activeProductsQuery->count(),
            'sales_volume' => (float) (Order::query()->sum('total_mad') ?? 0),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'sales_trend' => $this->salesTrend(),
            'category_distribution' => $this->categoryDistribution(),
        ]);
    }

    protected function salesTrend(): array
    {
        $startDate = now()->subMonths(5)->startOfMonth();

        $orders = Order::query()
            ->where('created_at', '>=', $startDate)
            ->orderBy('created_at')
            ->get();

        $months = collect(range(0, 5))->mapWithKeys(function (int $offset) {
            $monthStart = now()->subMonths(5 - $offset)->startOfMonth();

            return [
                $monthStart->format('Y-m') => [
                    'month' => $monthStart->translatedFormat('M'),
                    'sales' => 0.0,
                    'orders' => 0,
                ],
            ];
        });

        $monthData = $months->all();

        foreach ($orders as $order) {
            $monthKey = Carbon::parse($order->created_at)->format('Y-m');

            if (! array_key_exists($monthKey, $monthData)) {
                $monthStart = Carbon::parse($order->created_at)->startOfMonth();
                $monthData[$monthKey] = [
                    'month' => $monthStart->translatedFormat('M'),
                    'sales' => 0.0,
                    'orders' => 0,
                ];
            }

            $monthData[$monthKey]['sales'] = (float) $monthData[$monthKey]['sales'] + (float) $order->total_mad;
            $monthData[$monthKey]['orders'] = (int) $monthData[$monthKey]['orders'] + 1;
        }

        return array_values($monthData);
    }

    protected function categoryDistribution(): array
    {
        $categoryRows = Product::query()
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->where('products.is_active', true)
            ->where('categories.is_active', true)
            ->selectRaw('categories.name as name, COUNT(*) as value')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('value')
            ->get()
            ->map(fn ($row) => [
                'name' => $row->name,
                'value' => (int) $row->value,
            ])
            ->values()
            ->all();

        if ($categoryRows === []) {
            return [];
        }

        $total = array_sum(array_column($categoryRows, 'value'));
        $palette = ['#8b5cf6', '#22c55e', '#f59e0b', '#38bdf8', '#ec4899', '#f97316'];

        return array_map(function (array $row, int $index) use ($total, $palette) {
            $share = $total > 0 ? round(($row['value'] / $total) * 100, 1) : 0;

            return [
                'name' => $row['name'],
                'value' => $share,
                'color' => $palette[$index % count($palette)],
            ];
        }, $categoryRows, array_keys($categoryRows));
    }
}
