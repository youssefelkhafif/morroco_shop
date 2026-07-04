import { Link, useForm } from '@inertiajs/react';

export default function DeliveryZoneForm({ deliveryZone = null }) {
    const isEditing = Boolean(deliveryZone);

    const { data, setData, post, put, processing, errors } = useForm({
        city: deliveryZone?.city ?? '',
        district: deliveryZone?.district ?? '',
        zone_name: deliveryZone?.zone_name ?? '',
        delivery_fee_mad: deliveryZone?.delivery_fee_mad ?? '',
        estimated_delivery_days:
            deliveryZone?.estimated_delivery_days?.toString() ?? '',
        is_active: deliveryZone?.is_active ?? true,
    });

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(`/admin/delivery-zones/${deliveryZone.id}`);
            return;
        }

        post('/admin/delivery-zones');
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm"
        >
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="city"
                        className="block text-sm font-medium"
                    >
                        City
                    </label>

                    <input
                        id="city"
                        type="text"
                        value={data.city}
                        onChange={(event) =>
                            setData('city', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="Example: Casablanca"
                        autoFocus
                    />

                    {errors.city && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.city}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="district"
                        className="block text-sm font-medium"
                    >
                        District
                    </label>

                    <input
                        id="district"
                        type="text"
                        value={data.district}
                        onChange={(event) =>
                            setData('district', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="Example: Maarif"
                    />

                    {errors.district && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.district}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="zone_name"
                        className="block text-sm font-medium"
                    >
                        Zone name
                    </label>

                    <input
                        id="zone_name"
                        type="text"
                        value={data.zone_name}
                        onChange={(event) =>
                            setData('zone_name', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="Example: Standard or Express"
                    />

                    {errors.zone_name && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.zone_name}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="delivery_fee_mad"
                        className="block text-sm font-medium"
                    >
                        Delivery fee (MAD)
                    </label>

                    <input
                        id="delivery_fee_mad"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.delivery_fee_mad}
                        onChange={(event) =>
                            setData('delivery_fee_mad', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="20.00"
                    />

                    {errors.delivery_fee_mad && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.delivery_fee_mad}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="estimated_delivery_days"
                        className="block text-sm font-medium"
                    >
                        Estimated delivery days
                    </label>

                    <input
                        id="estimated_delivery_days"
                        type="number"
                        min="1"
                        max="255"
                        step="1"
                        value={data.estimated_delivery_days}
                        onChange={(event) =>
                            setData(
                                'estimated_delivery_days',
                                event.target.value,
                            )
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="Optional — Example: 2"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                        Leave empty when no estimate is available.
                    </p>

                    {errors.estimated_delivery_days && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.estimated_delivery_days}
                        </p>
                    )}
                </div>
            </div>

            <label className="flex items-center gap-3 text-sm">
                <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(event) =>
                        setData('is_active', event.target.checked)
                    }
                    className="h-4 w-4 rounded border-input"
                />
                Available for checkout
            </label>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing
                        ? 'Saving...'
                        : isEditing
                            ? 'Save changes'
                            : 'Create delivery zone'}
                </button>

                <Link
                    href="/admin/delivery-zones"
                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}