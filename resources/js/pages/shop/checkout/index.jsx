import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

export default function CheckoutIndex({
    cart,
    delivery_zones: deliveryZones,
    customer,
}) {
    const form = useForm({
        customer_name: customer?.name ?? '',
        customer_phone: '',
        customer_email: customer?.email ?? '',
        delivery_zone_id: '',
        delivery_address: '',
        customer_note: '',
    });

    const selectedZone = useMemo(
        () =>
            deliveryZones.find(
                (zone) => String(zone.id) === String(form.data.delivery_zone_id),
            ) ?? null,
        [deliveryZones, form.data.delivery_zone_id],
    );

    const estimatedTotal = selectedZone
        ? Number(cart.subtotal_mad) + Number(selectedZone.delivery_fee_mad)
        : null;

    function submit(event) {
        event.preventDefault();

        form.post('/checkout');
    }

    return (
        <>
            <Head title="Checkout" />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <Link
                            href="/cart"
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            ← Back to cart
                        </Link>

                        <h1 className="mt-3 text-3xl font-bold">
                            Checkout
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Pay cash on delivery. Your order will be saved first,
                            then WhatsApp opens for confirmation.
                        </p>
                    </div>

                    {form.errors.checkout && (
                        <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                            {form.errors.checkout}
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="grid gap-6 lg:grid-cols-[1fr_340px]"
                    >
                        <section className="space-y-6">
                            <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                                <h2 className="text-lg font-semibold">
                                    Customer information
                                </h2>

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <label className="block sm:col-span-2">
                                        <span className="text-sm font-medium">
                                            Full name
                                        </span>

                                        <input
                                            type="text"
                                            value={form.data.customer_name}
                                            onChange={(event) =>
                                                form.setData(
                                                    'customer_name',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                                            autoComplete="name"
                                        />

                                        {form.errors.customer_name && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {form.errors.customer_name}
                                            </p>
                                        )}
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium">
                                            Phone number
                                        </span>

                                        <input
                                            type="tel"
                                            value={form.data.customer_phone}
                                            onChange={(event) =>
                                                form.setData(
                                                    'customer_phone',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                                            placeholder="06XXXXXXXX"
                                            autoComplete="tel"
                                        />

                                        {form.errors.customer_phone && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {form.errors.customer_phone}
                                            </p>
                                        )}
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium">
                                            Email <span className="text-muted-foreground">(optional)</span>
                                        </span>

                                        <input
                                            type="email"
                                            value={form.data.customer_email}
                                            onChange={(event) =>
                                                form.setData(
                                                    'customer_email',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                                            autoComplete="email"
                                        />

                                        {form.errors.customer_email && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {form.errors.customer_email}
                                            </p>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                                <h2 className="text-lg font-semibold">
                                    Delivery information
                                </h2>

                                <div className="mt-5 space-y-5">
                                    <label className="block">
                                        <span className="text-sm font-medium">
                                            Delivery zone
                                        </span>

                                        <select
                                            value={form.data.delivery_zone_id}
                                            onChange={(event) =>
                                                form.setData(
                                                    'delivery_zone_id',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="">
                                                Select your city and zone
                                            </option>

                                            {deliveryZones.map((zone) => (
                                                <option key={zone.id} value={zone.id}>
                                                    {zone.city} · {zone.district} ·{' '}
                                                    {zone.zone_name} —{' '}
                                                    {formatMad(zone.delivery_fee_mad)}
                                                </option>
                                            ))}
                                        </select>

                                        {form.errors.delivery_zone_id && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {form.errors.delivery_zone_id}
                                            </p>
                                        )}

                                        {selectedZone && (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {selectedZone.estimated_delivery_days
                                                    ? `Estimated delivery: ${selectedZone.estimated_delivery_days} day(s).`
                                                    : 'Estimated delivery time will be confirmed by the shop.'}
                                            </p>
                                        )}
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium">
                                            Full delivery address
                                        </span>

                                        <textarea
                                            rows="4"
                                            value={form.data.delivery_address}
                                            onChange={(event) =>
                                                form.setData(
                                                    'delivery_address',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                                            placeholder="Building, street, apartment, landmark..."
                                            autoComplete="street-address"
                                        />

                                        {form.errors.delivery_address && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {form.errors.delivery_address}
                                            </p>
                                        )}
                                    </label>

                                    <label className="block">
                                        <span className="text-sm font-medium">
                                            Delivery note <span className="text-muted-foreground">(optional)</span>
                                        </span>

                                        <textarea
                                            rows="3"
                                            value={form.data.customer_note}
                                            onChange={(event) =>
                                                form.setData(
                                                    'customer_note',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                                            placeholder="Call before delivery, door details..."
                                        />

                                        {form.errors.customer_note && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {form.errors.customer_note}
                                            </p>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </section>

                        <aside className="h-fit rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                            <h2 className="text-lg font-semibold">
                                Order summary
                            </h2>

                            <div className="mt-5 space-y-4">
                                {cart.items.map((item) => (
                                    <div
                                        key={item.product_id}
                                        className="flex justify-between gap-4 text-sm"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-muted-foreground">
                                                {item.quantity} ×{' '}
                                                {formatMad(item.price_mad)}
                                            </p>
                                        </div>

                                        <p className="shrink-0 font-semibold">
                                            {formatMad(item.line_total_mad)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Products subtotal
                                    </span>

                                    <span className="font-medium">
                                        {formatMad(cart.subtotal_mad)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Delivery fee
                                    </span>

                                    <span className="font-medium">
                                        {selectedZone
                                            ? formatMad(
                                                  selectedZone.delivery_fee_mad,
                                              )
                                            : 'Select a zone'}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 border-t border-border pt-4 text-base font-bold">
                                    <span>Estimated COD total</span>

                                    <span>
                                        {estimatedTotal === null
                                            ? '—'
                                            : formatMad(estimatedTotal)}
                                    </span>
                                </div>
                            </div>

                            <p className="mt-4 text-xs leading-5 text-muted-foreground">
                                The final price, delivery fee, stock, and COD
                                amount are recalculated by Morocco Shop when
                                the order is created.
                            </p>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {form.processing
                                    ? 'Creating order...'
                                    : 'Create order and confirm on WhatsApp'}
                            </button>
                        </aside>
                    </form>
                </div>
            </main>
        </>
    );
}