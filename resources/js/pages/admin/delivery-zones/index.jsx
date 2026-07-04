import { Head, Link, router } from '@inertiajs/react';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

export default function DeliveryZonesIndex({ deliveryZones }) {
    const zones = deliveryZones?.data ?? [];

    function deleteZone(deliveryZone) {
        const confirmed = window.confirm(
            `Delete the delivery zone for ${deliveryZone.city}?`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/admin/delivery-zones/${deliveryZone.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Delivery zones" />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <Link
                                href="/admin"
                                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                                ← Back to admin dashboard
                            </Link>

                            <h1 className="mt-3 text-3xl font-bold">
                                Delivery zones
                            </h1>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Manage cities, delivery prices, and estimated
                                delivery times.
                            </p>
                        </div>

                        <Link
                            href="/admin/delivery-zones/create"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                        >
                            Add delivery zone
                        </Link>
                    </div>

                    <section className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        {zones.length === 0 ? (
                            <div className="p-8 text-center">
                                <h2 className="text-lg font-semibold">
                                    No delivery zones yet
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Add your first city to make delivery
                                    available during checkout.
                                </p>

                                <Link
                                    href="/admin/delivery-zones/create"
                                    className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                                >
                                    Add delivery zone
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-left text-sm">
                                    <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                                        <tr>
                                            <th className="px-5 py-4 font-medium">
                                                City
                                            </th>

                                            <th className="px-5 py-4 font-medium">
                                                District
                                            </th>

                                            <th className="px-5 py-4 font-medium">
                                                Zone
                                            </th>

                                            <th className="px-5 py-4 font-medium">
                                                Delivery fee
                                            </th>

                                            <th className="px-5 py-4 font-medium">
                                                Estimated time
                                            </th>

                                            <th className="px-5 py-4 font-medium">
                                                Status
                                            </th>

                                            <th className="px-5 py-4 text-right font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {zones.map((deliveryZone) => (
                                            <tr
                                                key={deliveryZone.id}
                                                className="border-b border-border last:border-b-0"
                                            >
                                                <td className="px-5 py-4 font-medium">
                                                    {deliveryZone.city}
                                                </td>

                                                <td className="px-5 py-4 text-muted-foreground">
                                                    {deliveryZone.district}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {deliveryZone.zone_name}
                                                </td>

                                                <td className="px-5 py-4">
                                                    {formatMad(deliveryZone.delivery_fee_mad)}
                                                </td>

                                                <td className="px-5 py-4 text-muted-foreground">
                                                    {deliveryZone.estimated_delivery_days
                                                        ? `${deliveryZone.estimated_delivery_days} day${deliveryZone.estimated_delivery_days === 1 ? '' : 's'}`
                                                        : 'Not specified'}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${deliveryZone.is_active
                                                                ? 'bg-primary/15 text-primary'
                                                                : 'bg-muted text-muted-foreground'
                                                            }`}
                                                    >
                                                        {deliveryZone.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-3">
                                                        <Link
                                                            href={`/admin/delivery-zones/${deliveryZone.id}/edit`}
                                                            className="font-medium text-primary hover:underline"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteZone(deliveryZone)}
                                                            className="font-medium text-destructive hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
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