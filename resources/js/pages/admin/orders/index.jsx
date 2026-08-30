import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

const formatStatus = (status) => {
    if (status === 'pending_whatsapp_confirmation') {
        return 'Pending confirmation';
    }

    return status
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

const statusClass = (status) => {
    if (status === 'confirmed' || status === 'delivered') {
        return 'bg-primary/15 text-primary';
    }

    if (
        status === 'cancelled' ||
        status === 'no_answer' ||
        status === 'refused_at_delivery' ||
        status === 'returned'
    ) {
        return 'bg-destructive/15 text-destructive';
    }

    return 'bg-muted text-muted-foreground';
};

export default function OrdersIndex({ orders, status }) {
    const rows = orders?.data ?? [];
    const activeStatus = status || 'all';

    return (
        <>
            <Head title="Orders" />

            <div className="min-h-screen bg-background text-foreground">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <main className="flex-1 p-6">
                        <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <Link
                            href="/admin"
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            ← Back to admin dashboard
                        </Link>

                        <h1 className="mt-3 text-3xl font-bold">
                            Orders
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Review customer orders and confirm stock only after admin approval.
                        </p>
                    </div>

                    <section className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/admin/orders"
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeStatus === 'all' ? 'bg-foreground text-background' : 'bg-muted/30 text-muted-foreground hover:bg-muted'}`}
                                >
                                    All
                                </Link>
                                <Link
                                    href="/admin/orders?status=pending_whatsapp_confirmation"
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeStatus === 'pending_whatsapp_confirmation' ? 'bg-foreground text-background' : 'bg-muted/30 text-muted-foreground hover:bg-muted'}`}
                                >
                                    Pending confirmation
                                </Link>
                                <Link
                                    href="/admin/orders?status=confirmed"
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeStatus === 'confirmed' ? 'bg-foreground text-background' : 'bg-muted/30 text-muted-foreground hover:bg-muted'}`}
                                >
                                    Confirmed
                                </Link>
                                <Link
                                    href="/admin/orders?status=shipped"
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeStatus === 'shipped' ? 'bg-foreground text-background' : 'bg-muted/30 text-muted-foreground hover:bg-muted'}`}
                                >
                                    Shipping order
                                </Link>
                                <Link
                                    href="/admin/orders?status=delivered"
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeStatus === 'delivered' ? 'bg-foreground text-background' : 'bg-muted/30 text-muted-foreground hover:bg-muted'}`}
                                >
                                    Delivered
                                </Link>
                            </div>

                            <form action="/admin/orders" method="get" className="flex w-full items-center gap-2 sm:w-auto">
                                {activeStatus !== 'all' && (
                                    <input type="hidden" name="status" value={activeStatus} />
                                )}
                                <label htmlFor="search" className="sr-only">
                                    Search orders
                                </label>
                                <input
                                    id="search"
                                    name="search"
                                    type="search"
                                    placeholder="Search order, customer, phone"
                                    className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/10 sm:w-72"
                                />
                                <button
                                    type="submit"
                                    className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                        {rows.length === 0 ? (
                            <div className="p-8 text-center">
                                <h2 className="text-lg font-semibold">
                                    No orders yet
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Orders will appear here after customers
                                    complete checkout.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1050px] text-left text-sm">
                                    <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                                        <tr>
                                            <th className="px-5 py-4 font-medium">
                                                Order
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Customer
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Delivery
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Items
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Cash on Delivery Total
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Status
                                            </th>
                                            <th className="px-5 py-4 text-right font-medium">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {rows.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-border last:border-b-0"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold">
                                                        {order.order_number}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {new Date(
                                                            order.created_at,
                                                        ).toLocaleString(
                                                            'en-MA',
                                                        )}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="font-medium">
                                                        {order.customer_name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {order.customer_phone}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 text-muted-foreground">
                                                    {order.delivery_city}
                                                    <span className="mx-1">·</span>
                                                    {order.delivery_district}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {order.items_count}
                                                </td>

                                                <td className="px-5 py-4 font-semibold">
                                                    {formatMad(order.cod_amount_mad)}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                                            order.status,
                                                        )}`}
                                                    >
                                                        {formatStatus(order.status)}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-right space-y-2 sm:space-y-0 sm:flex sm:justify-end sm:items-center sm:gap-2">
                                                    {order.status === 'pending_whatsapp_confirmation' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (! window.confirm('Confirm this order? Product stock will be deducted once.')) {
                                                                    return;
                                                                }

                                                                router.post(`/admin/orders/${order.id}/confirm`, {}, { preserveScroll: true });
                                                            }}
                                                            className="inline-flex items-center rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}

                                                    {(order.status === 'confirmed' || order.status === 'preparing') && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                router.post(`/admin/orders/${order.id}/ship`, {}, { preserveScroll: true });
                                                            }}
                                                            className="inline-flex items-center rounded-full bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                                                        >
                                                            Ship
                                                        </button>
                                                    )}

                                                    {order.status === 'shipped' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                router.post(`/admin/orders/${order.id}/deliver`, {}, { preserveScroll: true });
                                                            }}
                                                            className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                                                        >
                                                            Delivered
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

OrdersIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;