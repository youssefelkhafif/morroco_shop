import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

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
}) {
    const [addingProductId, setAddingProductId] = useState(null);

    const productRows = products?.data ?? [];

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
            <Head title="Morocco Shop" />

            <main className="min-h-screen bg-slate-50 text-slate-900">
                <header className="border-b bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
                        <Link href="/" className="text-xl font-black">
                            Morocco Shop
                        </Link>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/cart"
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                            >
                                Cart
                                {cartItemCount > 0 && (
                                    <span className="ml-2 rounded-full bg-slate-900 px-2 py-0.5 text-xs text-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                                >
                                    My Account
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Log in
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        Create account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <section className="border-b bg-white">
                    <div className="mx-auto max-w-6xl px-6 py-20">
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                            Cash on Delivery · Morocco
                        </p>

                        <h1 className="max-w-3xl text-5xl font-black leading-tight">
                            Order online. Confirm on WhatsApp. Pay at delivery.
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                            Browse products, place your order without an
                            account, then confirm it on WhatsApp.
                        </p>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-6 py-14">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black">
                            Available products
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Prices and stock are verified by Morocco Shop before
                            checkout.
                        </p>
                    </div>

                    {productRows.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <h3 className="text-lg font-bold">
                                No products available yet
                            </h3>

                            <p className="mt-2 text-sm text-slate-600">
                                The shop owner will add products soon.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {productRows.map((product) => {
                                const isOutOfStock =
                                    product.stock_quantity < 1;

                                const isAdding =
                                    addingProductId === product.id;

                                return (
                                    <article
                                        key={product.id}
                                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                                    >
                                        <div className="flex aspect-square items-center justify-center bg-slate-100">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm text-slate-500">
                                                    No product image
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {product.category_name && (
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                        {product.category_name}
                                                    </span>
                                                )}

                                                {product.is_featured && (
                                                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mt-3 text-lg font-bold">
                                                {product.name}
                                            </h3>

                                            {product.description && (
                                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                                                    {product.description}
                                                </p>
                                            )}

                                            <div className="mt-5 flex items-end justify-between gap-3">
                                                <div>
                                                    {product.old_price_mad && (
                                                        <p className="text-sm text-slate-400 line-through">
                                                            {formatMad(
                                                                product.old_price_mad,
                                                            )}
                                                        </p>
                                                    )}

                                                    <p className="text-xl font-black">
                                                        {formatMad(
                                                            product.price_mad,
                                                        )}
                                                    </p>
                                                </div>

                                                <p className="text-xs text-slate-500">
                                                    {isOutOfStock
                                                        ? 'Out of stock'
                                                        : `${product.stock_quantity} available`}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={isOutOfStock || isAdding}
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                                className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
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