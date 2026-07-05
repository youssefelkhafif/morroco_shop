import { Head, Link, router, usePage } from '@inertiajs/react';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

export default function CartIndex({ cart }) {
    const { errors } = usePage().props;

    function decreaseQuantity(item) {
        router.patch(
            `/cart/items/${item.product_id}`,
            {
                quantity: item.quantity - 1,
            },
            {
                preserveScroll: true,
            },
        );
    }

    function increaseQuantity(item) {
        router.patch(
            `/cart/items/${item.product_id}`,
            {
                quantity: item.quantity + 1,
            },
            {
                preserveScroll: true,
            },
        );
    }

    function removeItem(item) {
        router.delete(`/cart/items/${item.product_id}`, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Cart" />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            ← Continue shopping
                        </Link>

                        <h1 className="mt-3 text-3xl font-bold">
                            Your cart
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Prices and stock are verified by Morocco Shop before
                            an order is created.
                        </p>
                    </div>

                    {(errors.product_id || errors.quantity) && (
                        <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                            {errors.product_id || errors.quantity}
                        </div>
                    )}

                    {cart.items.length === 0 ? (
                        <section className="rounded-xl border border-border bg-card p-8 text-center text-card-foreground shadow-sm">
                            <h2 className="text-lg font-semibold">
                                Your cart is empty
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Add products from the shop to start an order.
                            </p>

                            <Link
                                href="/"
                                className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                            >
                                Browse products
                            </Link>
                        </section>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                            <section className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                                {cart.items.map((item) => (
                                    <article
                                        key={item.product_id}
                                        className="flex gap-4 border-b border-border p-5 last:border-b-0"
                                    >
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    No image
                                                </span>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate font-semibold">
                                                {item.name}
                                            </h2>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {formatMad(item.price_mad)} each
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex items-center rounded-lg border border-border">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decreaseQuantity(item)
                                                        }
                                                        disabled={
                                                            item.quantity <= 1
                                                        }
                                                        className="px-3 py-1.5 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="min-w-10 border-x border-border px-3 py-1.5 text-center text-sm font-semibold">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            increaseQuantity(item)
                                                        }
                                                        disabled={
                                                            item.quantity >=
                                                            item.stock_quantity
                                                        }
                                                        className="px-3 py-1.5 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <p className="font-semibold">
                                                        {formatMad(
                                                            item.line_total_mad,
                                                        )}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(item)
                                                        }
                                                        className="text-sm font-medium text-destructive hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </section>

                            <aside className="h-fit rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                                <h2 className="text-lg font-semibold">
                                    Cart summary
                                </h2>

                                <div className="mt-5 flex justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">
                                        Items ({cart.item_count})
                                    </span>

                                    <span className="font-semibold">
                                        {formatMad(cart.subtotal_mad)}
                                    </span>
                                </div>

                                <div className="mt-5 border-t border-border pt-5">
                                    <div className="flex justify-between gap-4 text-base font-bold">
                                        <span>Products subtotal</span>

                                        <span>
                                            {formatMad(cart.subtotal_mad)}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-xs text-muted-foreground">
                                        Delivery fee is calculated after the
                                        customer selects a delivery zone.
                                    </p>
                                </div>

                                <div className="mt-6 rounded-lg bg-muted p-3 text-center text-sm font-medium text-muted-foreground">
                                    Checkout comes next
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}