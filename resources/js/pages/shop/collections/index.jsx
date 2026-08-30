import { Head, Link } from '@inertiajs/react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

export default function CollectionIndex({ collections, cart_item_count: cartItemCount }) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    return (
        <>
            <Head title={t('collections.title')} />

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation cartItemCount={cartItemCount} />

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('collections.title')}</p>
                        <h1 className="mt-3 text-4xl font-black sm:text-5xl">{t('collections.subtitle')}</h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{t('collections.collectionsCopy')}</p>
                    </div>

                    {collections.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
                            <h2 className="text-lg font-bold">{t('collections.emptyTitle')}</h2>
                            <p className="mt-2 text-sm text-muted-foreground">{t('collections.emptyCopy')}</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {collections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/collections/${collection.id}`}
                                    className="group overflow-hidden rounded-[1.75rem] border border-border bg-card transition duration-300 hover:-translate-y-1"
                                >
                                    {collection.image_url ? (
                                        <img
                                            src={collection.image_url}
                                            alt={collection.title}
                                            className="h-64 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-64 items-center justify-center bg-muted text-muted-foreground">
                                            {t('common.noImage')}
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                                            {collection.badge}
                                        </p>
                                        <h2 className="mt-4 text-2xl font-black">{collection.title}</h2>
                                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{collection.subtitle}</p>
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
