import { Head, Link } from '@inertiajs/react';

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

export default function OrdersIndex({ orders }) {
    const rows = orders?.data ?? [];

    return (
        <>
            <Head title="Orders" />

            <main className="min-h-screen bg-background p-6 text-foreground">
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
                                                COD total
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

                                                <td className="px-5 py-4 text-right">
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
        </>
    );
}