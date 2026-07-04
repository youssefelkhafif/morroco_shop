import { Head, Link, router } from '@inertiajs/react';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

const formatStatus = (status) =>
    status
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

export default function ShowOrder({ order }) {
    const isPending =
        order.status === 'pending_whatsapp_confirmation';

    function confirmOrder() {
        const confirmed = window.confirm(
            'Confirm this order? Product stock will be deducted once.',
        );

        if (!confirmed) {
            return;
        }

        router.post(
            `/admin/orders/${order.id}/confirm`,
            {},
            {
                preserveScroll: true,
            },
        );
    }

    return (
        <>
            <Head title={order.order_number} />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <Link
                                href="/admin/orders"
                                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                                ← Back to orders
                            </Link>

                            <h1 className="mt-3 text-3xl font-bold">
                                {order.order_number}
                            </h1>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Created{' '}
                                {new Date(order.created_at).toLocaleString(
                                    'en-MA',
                                )}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground">
                                {formatStatus(order.status)}
                            </span>

                            <a
                                href={`/admin/orders/${order.id}/transport-pdf`}
                                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition hover:bg-muted"
                            >
                                Download transport PDF
                            </a>

                            {isPending && (
                                <button
                                    type="button"
                                    onClick={confirmOrder}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                                >
                                    Confirm order
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <section className="space-y-6 lg:col-span-2">
                            <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                                <h2 className="text-lg font-semibold">
                                    Ordered products
                                </h2>

                                <div className="mt-5 overflow-x-auto">
                                    <table className="w-full min-w-[620px] text-left text-sm">
                                        <thead className="border-b border-border text-muted-foreground">
                                            <tr>
                                                <th className="pb-3 font-medium">
                                                    Product
                                                </th>
                                                <th className="pb-3 font-medium">
                                                    Unit price
                                                </th>
                                                <th className="pb-3 font-medium">
                                                    Quantity
                                                </th>
                                                <th className="pb-3 text-right font-medium">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {order.items.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b border-border last:border-b-0"
                                                >
                                                    <td className="py-4 font-medium">
                                                        {item.product_name}
                                                    </td>
                                                    <td className="py-4">
                                                        {formatMad(
                                                            item.unit_price_mad,
                                                        )}
                                                    </td>
                                                    <td className="py-4">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="py-4 text-right font-semibold">
                                                        {formatMad(
                                                            item.line_total_mad,
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                                <h2 className="text-lg font-semibold">
                                    Delivery information
                                </h2>

                                <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Customer
                                        </dt>
                                        <dd className="mt-1 font-medium">
                                            {order.customer.name}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Phone
                                        </dt>
                                        <dd className="mt-1 font-medium">
                                            {order.customer.phone}
                                        </dd>
                                    </div>

                                    {order.customer.email && (
                                        <div>
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Email
                                            </dt>
                                            <dd className="mt-1 font-medium">
                                                {order.customer.email}
                                            </dd>
                                        </div>
                                    )}

                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Zone
                                        </dt>
                                        <dd className="mt-1 font-medium">
                                            {order.delivery.city}
                                            <span className="mx-1">·</span>
                                            {order.delivery.district}
                                            <span className="mx-1">·</span>
                                            {order.delivery.zone_name}
                                        </dd>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Address
                                        </dt>
                                        <dd className="mt-1 whitespace-pre-line font-medium">
                                            {order.delivery.address}
                                        </dd>
                                    </div>

                                    {order.customer_note && (
                                        <div className="sm:col-span-2">
                                            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Customer note
                                            </dt>
                                            <dd className="mt-1 whitespace-pre-line text-muted-foreground">
                                                {order.customer_note}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </section>

                        <aside className="space-y-6">
                            <section className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                                <h2 className="text-lg font-semibold">
                                    Cash on delivery
                                </h2>

                                <dl className="mt-5 space-y-3 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-muted-foreground">
                                            Products subtotal
                                        </dt>
                                        <dd>
                                            {formatMad(order.subtotal_mad)}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <dt className="text-muted-foreground">
                                            Delivery fee
                                        </dt>
                                        <dd>
                                            {formatMad(order.delivery_fee_mad)}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between gap-4 border-t border-border pt-3 text-base font-bold">
                                        <dt>COD to collect</dt>
                                        <dd>
                                            {formatMad(order.cod_amount_mad)}
                                        </dd>
                                    </div>
                                </dl>
                            </section>

                            <section className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                                <h2 className="text-lg font-semibold">
                                    Order timeline
                                </h2>

                                <dl className="mt-5 space-y-3 text-sm">
                                    <div>
                                        <dt className="text-muted-foreground">
                                            Stock deducted
                                        </dt>
                                        <dd className="mt-1 font-medium">
                                            {order.stock_deducted_at
                                                ? new Date(
                                                    order.stock_deducted_at,
                                                ).toLocaleString('en-MA')
                                                : 'Not deducted yet'}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-muted-foreground">
                                            Confirmed
                                        </dt>
                                        <dd className="mt-1 font-medium">
                                            {order.confirmed_at
                                                ? new Date(
                                                    order.confirmed_at,
                                                ).toLocaleString('en-MA')
                                                : 'Not confirmed yet'}
                                        </dd>
                                    </div>
                                </dl>
                            </section>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}