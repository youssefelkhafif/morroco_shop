import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import NotificationBell from '@/components/notification-bell';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

export default function ShopHome({
    auth,
    products,
    cart_item_count: cartItemCount,
    hero_badge,
    hero_title,
    hero_subtitle,
}) {
    const [addingProductId, setAddingProductId] = useState(null);

    const productRows = products?.data ?? [];
    const featuredProduct =
        productRows.find((product) => product.is_featured) ?? productRows[0] ?? null;

    function addToCart(product) {
        setAddingProductId(product.id);

        router.post(
            '/cart/items',
            {
                product_id: product.id,
                quantity: 1,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setAddingProductId(null);
                },
            },
        );
    }

    return (
        <>
            <Head title="Morocco Shop | Streetwear Caps" />

            <main className="min-h-screen bg-[#f7f7f3] text-[#111111]">
                <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/" className="text-lg font-black uppercase tracking-[0.24em]">
                            Streetwear Caps
                        </Link>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/cart"
                                className="rounded-full border border-black/10 px-3 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white sm:px-4"
                            >
                                Cart
                                {cartItemCount > 0 && (
                                    <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-[11px] text-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {auth?.user ? (
                                <>
                                    <Link
                                        href="/notification"
                                        className="rounded-full border border-black/10 px-3 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white sm:px-4"
                                    >
                                        Notification
                                    </Link>

                                    <Link
                                        href="/settings"
                                        className="rounded-full border border-black/10 px-3 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white sm:px-4"
                                    >
                                        Settings
                                    </Link>

                                    <NotificationBell />
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="hidden text-sm font-semibold text-black/70 sm:inline-flex"
                                    >
                                        Log in
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="rounded-full bg-black px-3 py-2 text-sm font-semibold text-white sm:px-4"
                                    >
                                        Create account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <section className="border-b border-black/10 bg-white">
                    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
                        <div className="flex flex-col justify-center">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-black/60">
                                {hero_badge}
                            </p>

                            <h1 className="max-w-3xl text-4xl font-black leading-[0.95] sm:text-5xl lg:text-6xl">
                                {hero_title}
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-black/70 sm:text-lg">
                                {hero_subtitle}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="#collection"
                                    className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
                                >
                                    Shop now
                                </Link>
                                <Link
                                    href="/cart"
                                    className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
                                >
                                    View cart
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-black/10 bg-[#f2efe7] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
                            <div className="rounded-[1.5rem] border border-black/10 bg-white p-4 sm:p-5">
                                <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
                                    <span>Featured drop</span>
                                    <span>Limited release</span>
                                </div>

                                {featuredProduct ? (
                                    <>
                                        <div className="overflow-hidden rounded-[1.25rem] bg-[#f7f6f1]">
                                            {featuredProduct.image_url ? (
                                                <img
                                                    src={featuredProduct.image_url}
                                                    alt={featuredProduct.name}
                                                    className="aspect-[4/5] w-full object-cover transition duration-500 hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex aspect-[4/5] items-center justify-center text-sm text-black/50">
                                                    No product image
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-end justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/50">
                                                    New arrival
                                                </p>
                                                <h2 className="mt-1 text-xl font-black">
                                                    {featuredProduct.name}
                                                </h2>
                                            </div>

                                            <p className="text-xl font-black">
                                                {formatMad(featuredProduct.price_mad)}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex aspect-[4/5] items-center justify-center rounded-[1.25rem] border border-dashed border-black/10 bg-[#faf8f2] text-sm text-black/60">
                                        New pieces will appear here soon.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="collection" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-black/50">
                                Collection
                            </p>
                            <h2 className="text-3xl font-black sm:text-4xl">
                                Curated streetwear caps
                            </h2>
                        </div>

                        <p className="max-w-2xl text-sm leading-7 text-black/65">
                            Clean silhouettes, premium finishing, and a sharp fit for everyday wear.
                        </p>
                    </div>

                    {productRows.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-black/10 bg-white p-10 text-center">
                            <h3 className="text-lg font-bold">
                                No products available yet
                            </h3>

                            <p className="mt-2 text-sm text-black/60">
                                The shop owner will add products soon.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {productRows.map((product) => {
                                const isOutOfStock = product.stock_quantity < 1;
                                const isAdding = addingProductId === product.id;

                                return (
                                    <article
                                        key={product.id}
                                        className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <Link href={`/products/${product.id}`} className="overflow-hidden rounded-[1.1rem] bg-[#f7f6f1] transition duration-300 hover:opacity-90">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                                />
                                            ) : (
                                                <div className="flex aspect-[3/4] items-center justify-center text-sm text-black/50">
                                                    No product image
                                                </div>
                                            )}
                                        </Link>

                                        <div className="px-1 pb-1 pt-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {product.category_name && (
                                                    <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/60">
                                                        {product.category_name}
                                                    </span>
                                                )}

                                                {product.is_featured && (
                                                    <span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            <Link href={`/products/${product.id}`} className="mt-3 block text-lg font-black uppercase tracking-[0.03em] transition hover:text-black/70">
                                                {product.name}
                                            </Link>

                                            {product.description && (
                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/60">
                                                    {product.description}
                                                </p>
                                            )}

                                            <div className="mt-4 flex items-end justify-between gap-3">
                                                <div>
                                                    {product.old_price_mad && (
                                                        <p className="text-sm text-black/35 line-through">
                                                            {formatMad(product.old_price_mad)}
                                                        </p>
                                                    )}

                                                    <p className="text-lg font-black">
                                                        {formatMad(product.price_mad)}
                                                    </p>
                                                </div>

                                                <p className="text-xs text-black/50">
                                                    {isOutOfStock
                                                        ? 'Out of stock'
                                                        : `${product.stock_quantity} available`}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={isOutOfStock || isAdding}
                                                onClick={() => addToCart(product)}
                                                className="mt-5 w-full rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/25"
                                            >
                                                {isAdding
                                                    ? 'Adding...'
                                                    : isOutOfStock
                                                      ? 'Out of stock'
                                                      : 'Add to cart'}
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}