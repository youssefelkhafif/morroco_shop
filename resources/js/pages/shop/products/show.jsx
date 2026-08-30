import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Sun, MoonStar } from 'lucide-react';
import { useAppContext } from '@/context/appContext';
import { useAppearance } from '@/hooks/use-appearance';
import { resolveTranslation } from '@/lib/translations';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

function OrderNowCard({
    product,
    selectedColor,
    selectedColorId,
    selectedQuantity,
    maxQuantity,
    isAdding,
    setSelectedColorId,
    setSelectedQuantity,
    addToCart,
    buyNow,
    t,
}) {
    return (
        <div className="space-y-6 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    {t('product.orderNow')}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    {t('product.orderNowCopy')}
                </p>
            </div>

            <div className="space-y-4 rounded-3xl border border-border bg-muted p-5">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                        {t('product.stock')}
                    </p>
                    <p className="mt-2 text-lg font-black text-foreground">
                        {product.stock_quantity > 0
                            ? t('product.available').replace('{count}', String(product.stock_quantity))
                            : t('product.outOfStock')}
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                        {t('product.color')}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                        {product.colors?.map((color) => (
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => setSelectedColorId(color.id)}
                                className={`flex h-12 min-w-[5rem] items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold transition ${
                                    selectedColorId === color.id
                                        ? 'border-foreground bg-foreground text-background'
                                        : 'border-border bg-card text-foreground'
                                }`}
                            >
                                <span
                                    className="h-4 w-4 rounded-full border border-border"
                                    style={{
                                        backgroundColor: color.hex_code || '#000',
                                    }}
                                />
                                {color.name}
                            </button>
                        ))}
                    </div>

                    {selectedColor && (
                        <p className="mt-3 text-sm text-muted-foreground">
                            {t('product.selectedColor')}{' '}
                            <span className="font-semibold">{selectedColor.name}</span>
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <label htmlFor="product-quantity" className="sr-only">
                    Quantity
                </label>
                <select
                    id="product-quantity"
                    value={selectedQuantity}
                    disabled={maxQuantity < 1}
                    onChange={(event) => {
                        const nextValue = Number(event.target.value);
                        setSelectedQuantity(Math.min(Math.max(nextValue, 1), maxQuantity || 1));
                    }}
                    className="w-24 rounded-full border border-border bg-background px-3 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-foreground"
                >
                    {Array.from({ length: Math.max(maxQuantity, 1) }, (_, index) => index + 1).map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    disabled={product.stock_quantity < 1 || isAdding}
                    onClick={addToCart}
                    className="flex-1 rounded-full bg-foreground px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:bg-foreground/30"
                >
                    {isAdding ? 'Adding…' : t('product.addToCart')}
                </button>
            </div>

            <button
                type="button"
                disabled={product.stock_quantity < 1 || isAdding}
                onClick={buyNow}
                className="inline-flex w-full items-center justify-center rounded-full border border-border px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition hover:bg-foreground/10 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
                {isAdding ? t('common.updating') : t('product.buyNow')}
            </button>
        </div>
    );
}

export default function ProductShow({ product, cart_item_count: cartItemCount }) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColorId, setSelectedColorId] = useState(
        product.colors?.[0]?.id ?? null,
    );
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const maxQuantity = Math.max(product.stock_quantity ?? 0, 0);

    useEffect(() => {
        if (maxQuantity <= 0) {
            setSelectedQuantity(0);

            return;
        }

        setSelectedQuantity((current) => Math.min(Math.max(current, 1), maxQuantity));
    }, [maxQuantity]);

    const selectedColor = useMemo(
        () =>
            product.colors?.find((color) => color.id === selectedColorId)
            ?? product.colors?.[0] ?? null,
        [product.colors, selectedColorId],
    );

    const mainImage = useMemo(
        () => product.images[selectedImageIndex] ?? product.images[0],
        [product.images, selectedImageIndex],
    );

    function addToCart() {
        if (maxQuantity < 1 || selectedQuantity < 1) {
            return;
        }

        setIsAdding(true);

        router.post(
            '/cart/items',
            {
                product_id: product.id,
                quantity: selectedQuantity,
                color_id: selectedColorId,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsAdding(false),
            },
        );
    }

    function buyNow() {
        if (maxQuantity < 1 || selectedQuantity < 1) {
            return;
        }

        setIsAdding(true);

        router.post(
            '/cart/items',
            {
                product_id: product.id,
                quantity: selectedQuantity,
                color_id: selectedColorId,
            },
            {
                preserveScroll: true,
                onSuccess: () => router.visit('/checkout'),
                onFinish: () => setIsAdding(false),
            },
        );
    }

    return (
        <>
            <Head title={t('product.titleTemplate').replace('{name}', product.name)} />

            <main className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <Link style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} href="/" className="text-base font-black uppercase tracking-[0.24em] text-foreground">
                            Streetwear Cap
                        </Link>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                aria-label="Toggle theme"
                                onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-foreground/10"
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <MoonStar className="h-4 w-4" />
                                )}
                            </button>

                            <Link href="/cart" className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:bg-foreground/10">
                                Cart ({cartItemCount})
                            </Link>
                        </div>
                    </div>
                </header>

                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                        {/* Left Column: Gallery & Product Info */}
                        <div className="space-y-6">
                            <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
                                <div className="hidden flex-col gap-4 lg:flex">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            type="button"
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`overflow-hidden rounded-3xl border transition duration-300 ${
                                                index === selectedImageIndex
                                                    ? 'border-foreground'
                                                    : 'border-border'
                                            }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`${product.name} image ${index + 1}`}
                                                className="h-28 w-28 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
                                    {mainImage ? (
                                        <img
                                            src={mainImage.url}
                                            alt={product.name}
                                            className="aspect-[4/5] w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full min-h-[420px] items-center justify-center p-16 text-sm text-muted-foreground">
                                            No product image available.
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 overflow-x-auto rounded-3xl pb-1 lg:hidden">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            type="button"
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`min-w-[6rem] overflow-hidden rounded-3xl border transition duration-300 ${
                                                index === selectedImageIndex
                                                    ? 'border-black'
                                                    : 'border-black/10'
                                            }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`${product.name} image ${index + 1}`}
                                                className="h-24 w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                                        {product.category_name ?? t('collections.productFallbackCategory')}
                                    </p>
                                    <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                                        {product.name}
                                    </h1>
                                </div>

                                <p className="text-3xl font-black tracking-[-0.03em]">
                                    {formatMad(product.price_mad)}
                                </p>
                            </div>

                            <div className="lg:hidden">
                                <OrderNowCard
                                    product={product}
                                    selectedColor={selectedColor}
                                    selectedColorId={selectedColorId}
                                    selectedQuantity={selectedQuantity}
                                    maxQuantity={maxQuantity}
                                    isAdding={isAdding}
                                    setSelectedColorId={setSelectedColorId}
                                    setSelectedQuantity={setSelectedQuantity}
                                    addToCart={addToCart}
                                    buyNow={buyNow}
                                    t={t}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[1.5rem] border border-border bg-card p-6">
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-black/60">
                                        {t('product.productDetails')}
                                    </h2>
                                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                        {product.description || t('product.detailsCopy')}
                                    </p>
                                </div>
                                <div className="rounded-[1.5rem] border border-border bg-card p-6">
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                        {t('product.shippingFit')}
                                    </h2>
                                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                        {t('product.shippingFitCopy')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: COMMANDER Box (Purchase Options) */}
                        <div className="space-y-6">
                            <div className="hidden lg:block">
                                <OrderNowCard
                                    product={product}
                                    selectedColor={selectedColor}
                                    selectedColorId={selectedColorId}
                                    selectedQuantity={selectedQuantity}
                                    maxQuantity={maxQuantity}
                                    isAdding={isAdding}
                                    setSelectedColorId={setSelectedColorId}
                                    setSelectedQuantity={setSelectedQuantity}
                                    addToCart={addToCart}
                                    buyNow={buyNow}
                                    t={t}
                                />
                            </div>

                            {/* Additional Info Cards */}
                            <div className="space-y-4 rounded-[1.5rem] border border-border bg-card p-5">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 h-8 w-8 rounded-full bg-black/5"></div>
                                    <div>
                                        <p className="text-sm font-semibold">{t('product.worldwideShipping')}</p>
                                        <p className="mt-2 text-sm text-muted-foreground">{t('product.worldwideShippingCopy')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 rounded-[1.5rem] border border-border bg-card p-5">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 h-8 w-8 rounded-full bg-black/5"></div>
                                    <div>
                                        <p className="text-sm font-semibold">{t('product.premiumQuality')}</p>
                                        <p className="mt-2 text-sm text-muted-foreground">{t('product.premiumQualityCopy')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
