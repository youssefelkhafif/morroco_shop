import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

export default function ProductsIndex({ products, paginated, cart_item_count: cartItemCount }) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);

    return (
        <>
            <Head title="All Products | Streetwear Caps" />

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation cartItemCount={cartItemCount} />

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('nav.shop')}</p>
                        <h1 className="mt-3 text-4xl font-black sm:text-5xl">{t('shop.title')}</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                            {t('shop.description')} {paginated.total} products available.
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
                            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h2 className="mt-4 text-lg font-bold">{t('shop.noProducts')}</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {t('shop.noProductsCopy')}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        className="group mx-auto flex w-[calc(100%-5px)] flex-col overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-full"
                                    >
                                        <div className="relative overflow-hidden bg-muted p-3 sm:p-4">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="h-48 w-full rounded-[1.25rem] object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                                                />
                                            ) : (
                                                <div className="flex h-48 items-center justify-center rounded-[1.25rem] bg-muted text-muted-foreground sm:h-56">
                                                    <ShoppingCart className="h-8 w-8" />
                                                </div>
                                            )}

                                            {product.is_featured && (
                                                <div className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                                                    {t('shop.featured')}
                                                </div>
                                            )}

                                            {product.stock_quantity === 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center rounded-[1.25rem] bg-black/45 backdrop-blur-sm">
                                                    <span className="text-sm font-bold text-white">{t('shop.outOfStock')}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                                            <div className="space-y-2">
                                                <h2 className="text-lg font-semibold leading-tight text-foreground">
                                                    {product.name}
                                                </h2>
                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    Premium streetwear cap crafted for everyday comfort and style.
                                                </p>
                                            </div>

                                            <div className="mt-5 flex items-end justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-black text-foreground">
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

                                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition group-hover:bg-foreground group-hover:text-background">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </span>
                                            </div>
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
                                        {t('shop.previous')}
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
                                        {t('shop.next')}
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
