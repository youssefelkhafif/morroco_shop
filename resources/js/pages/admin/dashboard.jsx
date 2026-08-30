import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import AdminLayout from '@/layouts/admin-layout';

const notifications = [
    {
        id: 1,
        title: 'Pending confirmations',
        description: '2 orders are waiting for admin approval.',
    },
    {
        id: 2,
        title: 'Delivery update',
        description: 'A delivery zone was updated and is ready for checkout.',
    },
    {
        id: 3,
        title: 'Stock alert',
        description: 'One product is running low and may need replenishment.',
    },
];

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value || 0));

export default function AdminDashboard({ stats = {}, sales_trend = [], category_distribution = [] }) {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const stockRemaining = Number(stats.stock_remaining || 0);
    const lowStockCount = Number(stats.low_stock_count || 0);
    const totalOrders = Number(stats.total_orders || 0);
    const completedOrders = Number(stats.completed_orders || 0);
    const totalCustomers = Number(stats.total_customers || 0);
    const activeCategories = Number(stats.active_categories || 0);
    const activeProducts = Number(stats.active_products || 0);
    const salesVolume = Number(stats.sales_volume || 0);

    const trendData = Array.isArray(sales_trend) && sales_trend.length
        ? sales_trend.map((entry) => ({
            month: entry.month,
            sales: Number(entry.sales || 0),
            orders: Number(entry.orders || 0),
        }))
        : [];

    const categoryData = Array.isArray(category_distribution) && category_distribution.length
        ? category_distribution.map((entry) => ({
            name: entry.name,
            value: Number(entry.value || 0),
            color: entry.color || '#8b5cf6',
        }))
        : [];

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-background text-foreground">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <main className="flex-1 p-6">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Streetwear Cap
                                    </p>

                                    <h1 className="text-3xl font-bold">
                                        Admin Dashboard
                                    </h1>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsNotificationsOpen(true)}
                                        className="relative rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                                    >
                                        <span className="text-base">🔔</span>
                                        <span className="ml-2">Alerts</span>
                                        <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                                            3
                                        </span>
                                    </button>

                                    <Link
                                        href="/"
                                        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                                    >
                                        View Store
                                    </Link>
                                </div>
                            </div>

                            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <article className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                            Inventory
                                        </p>
                                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">
                                            Active stock
                                        </span>
                                    </div>

                                    <p className="mt-5 text-3xl font-bold tracking-tight">
                                        {stockRemaining}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Total units remaining across active products.
                                    </p>

                                    <div className="mt-5 rounded-lg bg-muted/60 p-3 text-sm">
                                        <span className="font-semibold text-foreground">
                                            {lowStockCount}
                                        </span>
                                        {' '}
                                        products are low on stock.
                                    </div>
                                </article>

                                <article className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                            Sales
                                        </p>
                                        <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-600">
                                            Orders
                                        </span>
                                    </div>

                                    <p className="mt-5 text-3xl font-bold tracking-tight">
                                        {totalOrders}
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {totalCustomers} customers have purchased from the store.
                                    </p>

                                    <div className="mt-5 rounded-lg bg-muted/60 p-3 text-sm">
                                        <span className="font-semibold text-foreground">
                                            {completedOrders}
                                        </span>
                                        {' '}
                                        completed orders.
                                    </div>
                                </article>

                                <article className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm md:col-span-2 xl:col-span-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                            Catalog
                                        </p>
                                        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-600">
                                            Overview
                                        </span>
                                    </div>

                                    <div className="mt-5 space-y-3 text-sm">
                                        <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
                                            <span className="text-muted-foreground">Active categories</span>
                                            <span className="font-semibold text-foreground">{activeCategories}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
                                            <span className="text-muted-foreground">Products</span>
                                            <span className="font-semibold text-foreground">{activeProducts}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg bg-muted/60 p-3">
                                            <span className="text-muted-foreground">Sales volume</span>
                                            <span className="font-semibold text-foreground">{formatMad(salesVolume)}</span>
                                        </div>
                                    </div>
                                </article>
                            </section>

                            <section className="mt-6 grid gap-4 xl:grid-cols-[1.7fr_0.9fr]">
                                <article className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
                                    <div className="mb-5 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                                Performance
                                            </p>
                                            <h2 className="mt-1 text-xl font-semibold text-foreground">
                                                Sales & revenue trends
                                            </h2>
                                        </div>
                                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                            MAD
                                        </span>
                                    </div>

                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={trendData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" vertical={false} />
                                                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#111827',
                                                        border: '1px solid rgba(148,163,184,0.2)',
                                                        borderRadius: 12,
                                                        color: '#f8fafc',
                                                    }}
                                                    formatter={(value, name) => [
                                                        name === 'sales' ? formatMad(value) : `${value}`,
                                                        name === 'sales' ? 'Revenue' : 'Orders',
                                                    ]}
                                                />
                                                <Legend />
                                                <Bar dataKey="sales" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Revenue" />
                                                <Line type="monotone" dataKey="orders" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Completed orders" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </article>

                                <article className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
                                    <div className="mb-5">
                                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                            Distribution
                                        </p>
                                        <h2 className="mt-1 text-xl font-semibold text-foreground">
                                            Inventory mix
                                        </h2>
                                    </div>

                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    innerRadius={52}
                                                    outerRadius={86}
                                                    paddingAngle={4}
                                                >
                                                    {categoryData.map((entry) => (
                                                        <Cell key={entry.name} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#111827',
                                                        border: '1px solid rgba(148,163,184,0.2)',
                                                        borderRadius: 12,
                                                        color: '#f8fafc',
                                                    }}
                                                    formatter={(value) => [`${value}%`, 'Share']}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        {categoryData.map((item) => (
                                            <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-muted-foreground">{item.name}</span>
                                                </div>
                                                <span className="font-semibold text-foreground">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            </section>
                        </div>
                    </main>
                </div>
            </div>

            {isNotificationsOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 p-4 sm:p-6"
                    onClick={() => setIsNotificationsOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">
                                    Inbox
                                </p>
                                <h2 className="mt-1 text-xl font-semibold">
                                    Quick alerts
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsNotificationsOpen(false)}
                                className="rounded-full p-2 text-sm text-muted-foreground transition hover:bg-muted"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {notifications.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-border bg-background p-3"
                                >
                                    <p className="text-sm font-semibold text-foreground">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

AdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;