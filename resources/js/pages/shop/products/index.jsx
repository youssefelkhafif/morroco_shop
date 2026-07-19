import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';
import ShopNavigation from '@/components/shop-navigation';

export default function ProductsIndex({ products, paginated, cart_item_count: cartItemCount }) {
    return (
        <>
            <Head title="All Products | Streetwear Caps" />

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation cartItemCount={cartItemCount} />

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">Shop</p>
                        <h1 className="mt-3 text-4xl font-black sm:text-5xl">All Products</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                            Discover our complete collection of premium streetwear caps. {paginated.total} products available.
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
                            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h2 className="mt-4 text-lg font-bold">No products available</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Products will be added soon. Check back later!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card transition duration-300 hover:shadow-lg hover:-translate-y-1"
                                    >
                                        {/* Image Container */}
                                        <div className="relative overflow-hidden bg-muted">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-56 items-center justify-center bg-muted text-muted-foreground">
                                                    <ShoppingCart className="h-8 w-8" />
                                                </div>
                                            )}

                                            {/* Badge */}
                                            {product.is_featured && (
                                                <div className="absolute right-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                                                    Featured
                                                </div>
                                            )}

                                            {/* Stock Badge */}
                                            {product.stock_quantity === 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                                    <span className="text-sm font-bold text-white">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col p-5">
                                            {/* Price */}
                                            <div className="mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-black">
                                                        {product.price_mad} MAD
                                                    </span>
                                                    {product.old_price_mad && product.old_price_mad > product.price_mad && (
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            {product.old_price_mad} MAD
                                                        </span>
                                                    )}
                                                </div>
                                                {product.old_price_mad && product.old_price_mad > product.price_mad && (
                                                    <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                                                        Save {Math.round(((product.old_price_mad - product.price_mad) / product.old_price_mad) * 100)}%
                                                    </p>
                                                )}
                                            </div>

                                            {/* View Button */}
                                            <button
                                                type="button"
                                                disabled={product.stock_quantity === 0}
                                                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                View Details
                                                <ArrowUpRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {paginated.last_page > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-4">
                                    <Link
                                        href={`/products?page=${Math.max(1, paginated.current_page - 1)}`}
                                        disabled={paginated.current_page === 1}
                                        className={`rounded-lg px-4 py-2 font-semibold transition ${
                                            paginated.current_page === 1
                                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                                : 'border border-border hover:bg-foreground/5'
                                        }`}
                                    >
                                        Previous
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: paginated.last_page }, (_, i) => i + 1).map((page) => (
                                            <Link
                                                key={page}
                                                href={`/products?page=${page}`}
                                                className={`h-10 w-10 rounded-lg font-semibold transition flex items-center justify-center ${
                                                    page === paginated.current_page
                                                        ? 'bg-foreground text-background'
                                                        : 'border border-border hover:bg-foreground/5'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/products?page=${Math.min(paginated.last_page, paginated.current_page + 1)}`}
                                        disabled={paginated.current_page === paginated.last_page}
                                        className={`rounded-lg px-4 py-2 font-semibold transition ${
                                            paginated.current_page === paginated.last_page
                                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                                : 'border border-border hover:bg-foreground/5'
                                        }`}
                                    >
                                        Next
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </>
    );
}
