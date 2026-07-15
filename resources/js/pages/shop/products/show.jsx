import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

export default function ProductShow({ product, cart_item_count: cartItemCount }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColorId, setSelectedColorId] = useState(
        product.colors?.[0]?.id ?? null,
    );
    const [isAdding, setIsAdding] = useState(false);

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
        setIsAdding(true);

        router.post(
            '/cart/items',
            {
                product_id: product.id,
                quantity: 1,
                color_id: selectedColorId,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsAdding(false),
            },
        );
    }

    return (
        <>
            <Head title={`${product.name} | Morocco Shop`} />

            <main className="min-h-screen bg-[#faf8f6] text-black">
                <header className="sticky top-0 z-20 border-b border-black/10 bg-white/95 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/" className="text-base font-black uppercase tracking-[0.24em]">
                            Morocco Shop
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link href="/cart" className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white">
                                Cart ({cartItemCount})
                            </Link>
                        </div>
                    </div>
                </header>

                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
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
                                                    ? 'border-black'
                                                    : 'border-black/10'
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

                                <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-black/5">
                                    {mainImage ? (
                                        <img
                                            src={mainImage.url}
                                            alt={product.name}
                                            className="aspect-[4/5] w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full min-h-[420px] items-center justify-center p-16 text-sm text-black/50">
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
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/50">
                                        {product.category_name ?? 'Streetwear'}
                                    </p>
                                    <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                                        {product.name}
                                    </h1>
                                </div>

                                <p className="text-3xl font-black tracking-[-0.03em]">
                                    {formatMad(product.price_mad)}
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[1.5rem] border border-black/10 bg-white p-6">
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-black/60">
                                        Product details
                                    </h2>
                                    <p className="mt-4 text-sm leading-7 text-black/75">
                                        {product.description || 'No description available yet.'}
                                    </p>
                                </div>
                                <div className="rounded-[1.5rem] border border-black/10 bg-white p-6">
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-black/60">
                                        Shipping & fit
                                    </h2>
                                    <p className="mt-4 text-sm leading-7 text-black/75">
                                        Fast local delivery. Careful packaging. Designed to fit most head sizes with a structured premium finish.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/50">
                                        Order now
                                    </p>
                                    <p className="mt-2 text-sm text-black/70">
                                        Cash on delivery - confirm your order on WhatsApp after checkout.
                                    </p>
                                </div>

                                <div className="space-y-4 rounded-3xl border border-black/10 bg-[#f7f5ef] p-5">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.35em] text-black/50">
                                            Stock
                                        </p>
                                        <p className="mt-2 text-lg font-black text-black">
                                            {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.35em] text-black/50">
                                            Color
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-3">
                                            {product.colors?.map((color) => (
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    onClick={() => setSelectedColorId(color.id)}
                                                    className={`flex h-12 min-w-[5rem] items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold transition ${
                                                        selectedColorId === color.id
                                                            ? 'border-black bg-black text-white'
                                                            : 'border-black/10 bg-white text-black'
                                                    }`}
                                                >
                                                    <span
                                                        className="h-4 w-4 rounded-full border border-black/10"
                                                        style={{
                                                            backgroundColor:
                                                                color.hex_code || '#000',
                                                        }}
                                                    />
                                                    {color.name}
                                                </button>
                                            ))}
                                        </div>

                                        {selectedColor && (
                                            <p className="mt-3 text-sm text-black/60">
                                                Selected: <span className="font-semibold">{selectedColor.name}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={product.stock_quantity < 1 || isAdding}
                                onClick={addToCart}
                                className="w-full rounded-full bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/30"
                            >
                                {isAdding ? 'Adding…' : 'Add to cart'}
                            </button>

                            <Link
                                href="/checkout"
                                className="inline-flex w-full items-center justify-center rounded-full border border-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-black/5"
                            >
                                Buy now
                            </Link>

                            <div className="space-y-4 rounded-[1.5rem] border border-black/10 bg-[#faf9f5] p-5">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 h-8 w-8 rounded-full bg-black/5"></div>
                                    <div>
                                        <p className="text-sm font-semibold">Worldwide shipping</p>
                                        <p className="mt-2 text-sm text-black/70">Fast local delivery and tracked packing.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 h-8 w-8 rounded-full bg-black/5"></div>
                                    <div>
                                        <p className="text-sm font-semibold">Premium quality</p>
                                        <p className="mt-2 text-sm text-black/70">Bold fit, low profile, sharp construction.</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </>
    );
}
