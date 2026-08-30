import { Head, Link } from '@inertiajs/react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

export default function CollectionShow({ collection, cart_item_count: cartItemCount }) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    return (
        <>
            <Head title={t('collections.titleTemplate').replace('{name}', collection.title)} />

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation cartItemCount={cartItemCount} />

                <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(239,235,228,0.72))] dark:bg-[radial-gradient(circle_at_top_left,rgba(40,40,40,0.6),rgba(20,20,20,0.9))]">
                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="max-w-4xl">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{collection.badge}</p>
                            <h1 className="mt-5 text-5xl font-black tracking-[-0.03em] sm:text-6xl">{collection.title}</h1>
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{collection.subtitle}</p>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    {collection.products.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
                            <h2 className="text-lg font-bold">{t('collections.noProductsTitle')}</h2>
                            <p className="mt-2 text-sm text-muted-foreground">{t('collections.noProductsCopy')}</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {collection.products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="group overflow-hidden rounded-[1.75rem] border border-border bg-card transition duration-300 hover:-translate-y-1"
                                >
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-80 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-80 items-center justify-center bg-muted text-muted-foreground">
                                            {t('common.noImage')}
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{product.category_name ?? t('collections.productFallbackCategory')}</p>
                                        <h2 className="mt-4 text-2xl font-black">{product.name}</h2>
                                        <p className="mt-4 text-lg font-semibold">{formatMad(product.price_mad)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
