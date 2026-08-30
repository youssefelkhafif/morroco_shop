import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Heart, PackageCheck, RefreshCcw, Sparkles, Truck } from 'lucide-react';
import { useState } from 'react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

const categories = [
    { titleKey: 'home.categories.caps.title', descriptionKey: 'home.categories.caps.description', accent: 'from-black to-zinc-700' },
    { titleKey: 'home.categories.snapbacks.title', descriptionKey: 'home.categories.snapbacks.description', accent: 'from-zinc-700 to-zinc-500' },
    { titleKey: 'home.categories.trucker.title', descriptionKey: 'home.categories.trucker.description', accent: 'from-stone-700 to-stone-500' },
    { titleKey: 'home.categories.beanies.title', descriptionKey: 'home.categories.beanies.description', accent: 'from-stone-600 to-stone-400' },
    { titleKey: 'home.categories.limited.title', descriptionKey: 'home.categories.limited.description', accent: 'from-neutral-800 to-neutral-600' },
    { titleKey: 'home.categories.future.title', descriptionKey: 'home.categories.future.description', accent: 'from-zinc-900 to-zinc-700' },
];

const collections = [
    { titleKey: 'home.collectionCards.summerDrop.title', subtitleKey: 'home.collectionCards.summerDrop.subtitle', badgeKey: 'home.collectionCards.summerDrop.badge' },
    { titleKey: 'home.collectionCards.essentials.title', subtitleKey: 'home.collectionCards.essentials.subtitle', badgeKey: 'home.collectionCards.essentials.badge' },
    { titleKey: 'home.collectionCards.limitedRelease.title', subtitleKey: 'home.collectionCards.limitedRelease.subtitle', badgeKey: 'home.collectionCards.limitedRelease.badge' },
];

const reasons = [
    { icon: BadgeCheck, titleKey: 'home.reasons.premiumMaterials.title', descriptionKey: 'home.reasons.premiumMaterials.description' },
    { icon: PackageCheck, titleKey: 'home.reasons.cashOnDelivery.title', descriptionKey: 'home.reasons.cashOnDelivery.description' },
    { icon: Truck, titleKey: 'home.reasons.fastShipping.title', descriptionKey: 'home.reasons.fastShipping.description' },
    { icon: RefreshCcw, titleKey: 'home.reasons.easyReturns.title', descriptionKey: 'home.reasons.easyReturns.description' },
];

export default function ShopHome({
    auth,
    products,
    cart_item_count: cartItemCount,
    hero_badge,
    hero_title,
    hero_subtitle,
}) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    const [addingProductId, setAddingProductId] = useState(null);

    const productRows = products?.data ?? [];
    const featuredProduct =
        productRows.find((product) => product.is_featured) ?? productRows[0] ?? null;
    const featuredProducts = productRows.slice(0, 4);
    const arrivals = productRows.slice(0, 4);

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

            <main className="min-h-screen bg-[#f7f5f1] text-foreground dark:bg-[#111111] dark:text-white">
                <ShopNavigation auth={auth} cartItemCount={cartItemCount} />

                <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(239,235,228,0.72))] dark:bg-[radial-gradient(circle_at_top_left,rgba(40,40,40,0.6),rgba(20,20,20,0.9))]">
                    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
                        <div className="flex flex-col justify-center">
                            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground backdrop-blur">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>{hero_badge}</span>
                            </div>

                            <h1 className="max-w-3xl text-5xl font-black leading-[0.9] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                                {hero_title}
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                                {hero_subtitle}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href="#collection" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                                    {t('nav.shopNow')}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link href="#collections" className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted">
                                    {t('nav.exploreCollection')}
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-6 border-t border-border pt-6 text-sm text-muted-foreground">
                                <div>
                                    <p className="font-semibold text-foreground">{t('home.premiumFit')}</p>
                                    <p>{t('home.editorialSilhouettes')}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{t('home.limitedDrops')}</p>
                                    <p>{t('home.newEverySeason')}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{t('home.cashOnDelivery')}</p>
                                    <p>{t('common.builtForMorocco')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-muted/50 blur-3xl" />
                            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card/90 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.16)] backdrop-blur">
                                <div className="overflow-hidden rounded-[1.5rem] bg-muted/70">
                                    {featuredProduct?.image_url ? (
                                        <img src={featuredProduct.image_url} alt={featuredProduct.name} className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-105" />
                                    ) : (
                                        <div className="flex aspect-[4/5] items-center justify-center text-sm text-muted-foreground">{t('home.featuredProductImage')}</div>
                                    )}
                                </div>
                                <div className="mt-4 flex items-end justify-between gap-3 px-2 pb-2">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">{t('home.featuredDrop')}</p>
                                        <h2 className="mt-1 text-xl font-black">{featuredProduct?.name ?? t('home.signatureCap')}</h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">{t('home.fromLabel')}</p>
                                        <p className="text-xl font-black">{featuredProduct ? formatMad(featuredProduct.price_mad) : 'MAD 0.00'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="collections" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('home.collections')}</p>
                            <h2 className="text-3xl font-black sm:text-4xl">{t('home.designedForEveryMood')}</h2>
                        </div>
                        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{t('home.collectionsCopy')}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                        {categories.map((category) => (
                            <div key={category.title} className="group overflow-hidden rounded-[1.5rem] border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className={`h-24 rounded-[1rem] bg-gradient-to-br ${category.accent}`} />
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">{t(category.titleKey)}</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(category.descriptionKey)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {collections.map((collection) => (
                            <div key={collection.titleKey} className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 transition duration-300 hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/20 to-transparent" />
                                <div className="relative flex min-h-[320px] flex-col justify-end rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(0,0,0,0.35))] p-6">
                                    <p className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur">{t(collection.badgeKey)}</p>
                                    <h3 className="text-2xl font-black text-white">{t(collection.titleKey)}</h3>
                                    <p className="mt-2 max-w-sm text-sm leading-7 text-white/80">{t(collection.subtitleKey)}</p>
                                    <Link href="#collection" className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white">
                                        {t('nav.viewCollection')}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="collection" className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('home.featuredProducts')}</p>
                            <h2 className="text-3xl font-black sm:text-4xl">{t('home.modernEssentials')}</h2>
                        </div>
                    </div>

                    {featuredProducts.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
                            <h3 className="text-lg font-bold">{t('home.noProducts')}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{t('home.noProductsCopy')}</p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {featuredProducts.map((product) => {
                                const isOutOfStock = product.stock_quantity < 1;
                                const isAdding = addingProductId === product.id;

                                return (
                                    <article key={product.id} className="group overflow-hidden rounded-[1.75rem] border border-border bg-card p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <div className="relative overflow-hidden rounded-[1.25rem] bg-muted/80">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                                            ) : (
                                                <div className="flex aspect-[4/5] items-center justify-center text-sm text-muted-foreground">{t('common.noProductImage')}</div>
                                            )}
                                            <button type="button" className="absolute right-3 top-3 rounded-full border border-white/40 bg-white/80 p-2 text-foreground backdrop-blur transition hover:bg-white" aria-label={`Add ${product.name} to wishlist`}>
                                                <Heart className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="px-1 pb-1 pt-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{product.category_name ?? t('home.signatureCap')}</p>
                                                <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{isOutOfStock ? t('home.soldOut') : t('home.inStock')}</span>
                                            </div>

                                            <Link href={`/products/${product.id}`} className="mt-3 block text-lg font-black uppercase tracking-[0.03em] transition hover:text-muted-foreground">{product.name}</Link>

                                            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
                                                <span>{t('home.productColors')}</span>
                                            </div>

                                            <div className="mt-4 flex items-end justify-between gap-3">
                                                <p className="text-lg font-black">{formatMad(product.price_mad)}</p>
                                                <button type="button" disabled={isOutOfStock || isAdding} onClick={() => addToCart(product)} className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:bg-foreground/40">
                                                    {isAdding ? t('common.saving') : t('home.quickAdd')}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-[2rem] border border-border bg-black text-white">
                        <div className="grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-16">
                                <div className="relative lg:col-span-2 flex flex-col justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur min-h-[280px] lg:min-h-[360px]">
                                    <video src="/video/0718.mp4" autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/45" />
                                    <div className="relative z-10">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/65">{t('home.editorialDrop')}</p>
                                <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{t('home.editorialHeadline')}</h2>
                                <p className="mt-5 max-w-xl text-base leading-8 text-white/70">{t('home.streetwearCopy')}</p>
                                <Link href="#collection" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                                    {t('nav.exploreCollection')}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                    </div>
                                </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('home.newArrivals')}</p>
                            <h2 className="text-3xl font-black sm:text-4xl">{t('home.freshFromStudio')}</h2>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {arrivals.map((product) => (
                            <div key={product.id} className="group overflow-hidden rounded-[1.5rem] border border-border bg-card p-3 transition duration-300 hover:-translate-y-1">
                                <div className="overflow-hidden rounded-[1.15rem] bg-muted/70">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                                    ) : (
                                        <div className="flex aspect-[4/5] items-center justify-center text-sm text-muted-foreground">{t('home.preview')}</div>
                                    )}
                                </div>
                                <div className="mt-4 px-1 pb-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold">{product.name}</p>
                                        <p className="text-sm font-semibold">{formatMad(product.price_mad)}</p>
                                    </div>
                                    <button type="button" onClick={() => addToCart(product)} className="mt-4 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted">
                                        {t('home.quickAdd')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {reasons.map((reason) => {
                            const Icon = reason.icon;
                            return (
                                <div 
                                    key={reason.titleKey} 
                                    className="group relative overflow-hidden rounded-[1.5rem] border border-border/60 bg-gradient-to-br from-card via-card to-card/95 p-6 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-foreground/30 hover:shadow-lg"
                                >
                                    {/* Subtle gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                                    
                                    <div className="relative">
                                        {/* Icon wrapper with ring effect */}
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border/40 bg-gradient-to-br from-muted via-muted to-muted/80 text-foreground shadow-sm ring-1 ring-primary/20 transition duration-300 group-hover:ring-primary/40 group-hover:shadow-md group-hover:scale-110">
                                            <Icon className="h-7 w-7 transition duration-300 group-hover:text-primary" />
                                        </div>
                                        
                                        {/* Text content */}
                                        <h3 className="mt-5 text-lg font-semibold transition duration-300 group-hover:text-foreground">{t(reason.titleKey)}</h3>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground transition duration-300 group-hover:text-muted-foreground/90">{t(reason.descriptionKey)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-border bg-card px-6 py-12 text-center sm:px-10 lg:px-16">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('home.stayClose')}</p>
                        <h2 className="mt-3 text-3xl font-black sm:text-4xl">{t('home.joinTheNextDrop')}</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{t('home.joinCopy')}</p>
                        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                            <input type="email" placeholder={t('home.emailPlaceholder')} className="h-12 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none ring-0 focus:border-foreground" />
                            <button type="button" className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">{t('home.joinNow')}</button>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-border bg-card/70">
                    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
                        <div>
                            <p className="text-lg font-black uppercase tracking-[0.28em] text-foreground">Streetwear Caps</p>
                            <p className="mt-3 max-w-sm leading-7">{t('home.minimalLuxury')}</p>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-3">
                            <div>
                                <p className="font-semibold text-foreground">{t('home.footerCollections')}</p>
                                <ul className="mt-3 space-y-2">
                                    <li><Link href="#collections" className="hover:text-foreground">{t('home.footerCaps')}</Link></li>
                                    <li><Link href="#collections" className="hover:text-foreground">{t('home.footerSnapbacks')}</Link></li>
                                    <li><Link href="#collections" className="hover:text-foreground">{t('home.footerLimited')}</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{t('home.support')}</p>
                                <ul className="mt-3 space-y-2">
                                    <li><Link href="/about" className="hover:text-foreground">{t('nav.about')}</Link></li>
                                    <li><Link href="/cart" className="hover:text-foreground">{t('nav.cart')}</Link></li>
                                    <li><Link href="/notification" className="hover:text-foreground">{t('nav.orders')}</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{t('home.company')}</p>
                                <ul className="mt-3 space-y-2">
                                    <li><Link href="/shipping-policy" className="hover:text-foreground">{t('home.shippingPolicy')}</Link></li>
                                    <li><Link href="/privacy-policy" className="hover:text-foreground">{t('home.privacyPolicy')}</Link></li>
                                    <li><a href="mailto:hello@streetwearcaps.com" className="hover:text-foreground">{t('nav.contact')}</a></li>
                                    <li><a href="https://www.instagram.com/street_wearcap" target="_blank" rel="noreferrer" className="hover:text-foreground">Instagram</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}