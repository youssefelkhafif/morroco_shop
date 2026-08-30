import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import ShopNavigation from '@/components/shop-navigation';
import NotificationBell from '@/components/notification-bell';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

function DeliveryDetailsSection({ form, deliveryZones, selectedZone, t }) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="text-lg font-semibold">{t('checkout.deliveryInfo')}</h2>

            <div className="mt-5 space-y-5">
                <label className="block">
                    <span className="text-sm font-medium">
                        {t('checkout.deliveryZone')}{' '}
                        <span className="text-destructive">*</span>
                    </span>

                    <select
                        required
                        value={form.data.delivery_zone_id}
                        onChange={(event) =>
                            form.setData('delivery_zone_id', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                    >
                        <option value="">{t('checkout.selectCity')}</option>

                        {deliveryZones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                                {zone.city} · {zone.district} · {zone.zone_name}{' '}
                                — {formatMad(zone.delivery_fee_mad)}
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
                                ? `${t('checkout.estimatedDelivery')}: ${selectedZone.estimated_delivery_days} day(s).`
                                : t('checkout.estimatedDeliveryUnknown')}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className="text-sm font-medium">
                        {t('checkout.fullAddress')}{' '}
                        <span className="text-destructive">*</span>
                    </span>

                    <textarea
                        rows="4"
                        required
                        value={form.data.delivery_address}
                        onChange={(event) =>
                            form.setData('delivery_address', event.target.value)
                        }
                        className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                        placeholder={t('checkout.addressPlaceholder')}
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
                        {t('checkout.deliveryNote')}
                    </span>

                    <textarea
                        rows="3"
                        value={form.data.customer_note}
                        onChange={(event) =>
                            form.setData('customer_note', event.target.value)
                        }
                        className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                        placeholder={t('checkout.notePlaceholder')}
                    />

                    {form.errors.customer_note && (
                        <p className="mt-1 text-sm text-destructive">
                            {form.errors.customer_note}
                        </p>
                    )}
                </label>
            </div>
        </div>
    );
}

export default function CheckoutIndex({
    cart,
    delivery_zones: deliveryZones,
    cart_item_count: cartItemCount,
}) {
    const {
        auth,
        orderPlaced: orderPlacedProp,
        orderNumber,
        orderTotal,
    } = usePage().props;
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    const [isOrderPlacedModalOpen, setIsOrderPlacedModalOpen] = useState(
        Boolean(orderPlacedProp),
    );
    const [hasTrackedPurchase, setHasTrackedPurchase] = useState(false);

    const orderPlaced = Boolean(orderPlacedProp || isOrderPlacedModalOpen);

    useEffect(() => {
        if (orderPlacedProp) {
            setIsOrderPlacedModalOpen(true);
        }
    }, [orderPlacedProp]);

    useEffect(() => {
        if (!orderPlaced || !orderNumber || !orderTotal || hasTrackedPurchase) {
            return;
        }

        if (typeof window === 'undefined') {
            return;
        }

        const storageKey = `meta-pixel-purchase:${orderNumber}`;

        if (window.sessionStorage.getItem(storageKey) === '1') {
            setHasTrackedPurchase(true);
            return;
        }

        if (typeof window.fbq === 'function') {
            window.fbq('track', 'Purchase', {
                value: Number(orderTotal),
                currency: 'MAD',
            });
        }

        window.sessionStorage.setItem(storageKey, '1');
        setHasTrackedPurchase(true);
    }, [hasTrackedPurchase, orderPlaced, orderNumber, orderTotal]);

    function closeModal() {
        setIsOrderPlacedModalOpen(false);
        router.visit('/', { preserveState: false });
    }

    const form = useForm({
        customer_name: '',
        customer_phone: '',
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

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation cartItemCount={cartItemCount} />

                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <Link
                                href="/cart"
                                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                                ← {t('checkout.backToCart')}
                            </Link>

                            <h1 className="mt-3 text-3xl font-bold">
                                {t('checkout.title')}
                            </h1>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {t('checkout.subtitle')}
                            </p>
                        </div>
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
                                    {t('checkout.customerInfo')}
                                </h2>

                                <div className="mt-5 space-y-5">
                                    <label className="block">
                                        <span className="text-sm font-medium">
                                            {t('checkout.fullName')} <span className="text-destructive">*</span>
                                        </span>

                                        <input
                                            type="text"
                                            required
                                            value={form.data.customer_name}
                                            onChange={(event) =>
                                                form.setData(
                                                    'customer_name',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                                            placeholder={t('checkout.fullNamePlaceholder')}
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
                                            {t('checkout.phoneNumber')} <span className="text-destructive">*</span>
                                        </span>

                                        <input
                                            type="tel"
                                            required
                                            value={form.data.customer_phone}
                                            onChange={(event) =>
                                                form.setData(
                                                    'customer_phone',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                                            placeholder={t('checkout.phoneNumberPlaceholder')}
                                            autoComplete="tel"
                                        />

                                        {form.errors.customer_phone && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {form.errors.customer_phone}
                                            </p>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <DeliveryDetailsSection
                                form={form}
                                deliveryZones={deliveryZones}
                                selectedZone={selectedZone}
                                t={t}
                            />
                        </section>

                        <aside className="h-fit rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                            <h2 className="text-lg font-semibold">
                                {t('checkout.orderSummary')}
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
                                        {t('checkout.productsSubtotal')}
                                    </span>

                                    <span className="font-medium">
                                        {formatMad(cart.subtotal_mad)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        {t('checkout.deliveryFee')}
                                    </span>

                                    <span className="font-medium">
                                        {selectedZone
                                            ? formatMad(
                                                  selectedZone.delivery_fee_mad,
                                              )
                                            : t('checkout.selectZone')}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 border-t border-border pt-4 text-base font-bold">
                                    <span>{t('checkout.estimatedTotal')}</span>

                                    <span>
                                        {estimatedTotal === null
                                            ? '—'
                                            : formatMad(estimatedTotal)}
                                    </span>
                                </div>
                            </div>

                            <p className="mt-4 text-xs leading-5 text-muted-foreground">
                                {t('checkout.finalPriceNote')}
                            </p>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {form.processing
                                    ? t('checkout.placingOrder')
                                    : estimatedTotal !== null
                                    ? `${t('checkout.confirmOrder')} — ${formatMad(estimatedTotal)}`
                                    : t('checkout.confirmOrder')}
                            </button>
                        </aside>
                    </form>

                    {isOrderPlacedModalOpen && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-6 backdrop-blur-xl"
                            style={{ backgroundColor: 'rgba(12, 11, 12, 0.85)' }}
                            onClick={closeModal}
                        >
                            <div
                                className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 p-8 shadow-[0_32px_120px_-40px_rgba(0,0,0,0.25)] backdrop-blur"
                                style={{ backgroundColor: '#0c0b0c' }}
                                onClick={(event) => event.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                                    aria-label="Close order confirmation"
                                >
                                    <span className="text-lg font-semibold">×</span>
                                </button>

                                <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-[#0c0b0c] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0c0b0c] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="h-12 w-12 text-white"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="text-center text-white">
                                    <h2 className="text-3xl font-semibold tracking-tight">
                                        {t('checkout.orderConfirmed')}
                                    </h2>
                                    <p className="mx-auto mt-4 max-w-md text-sm text-slate-300">
                                        {t('checkout.thankYou')}
                                    </p>
                                </div>

                                {orderNumber && (
                                    <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-300">
                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                            {t('checkout.orderNumber')}
                                        </p>
                                        <p className="mt-2 font-semibold tracking-[0.3em] text-white">
                                            {orderNumber}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-10 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                                    >
                                        {t('checkout.continueShopping')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}