import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Heart, PackageCheck, RefreshCcw, Truck } from 'lucide-react';
import { useRef, useState } from 'react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

const reasons = [
    { icon: BadgeCheck, titleKey: 'home.reasons.premiumMaterials.title', descriptionKey: 'home.reasons.premiumMaterials.description' },
    { icon: PackageCheck, titleKey: 'home.reasons.cashOnDelivery.title', descriptionKey: 'home.reasons.cashOnDelivery.description' },
    { icon: Truck, titleKey: 'home.reasons.fastShipping.title', descriptionKey: 'home.reasons.fastShipping.description' },
    { icon: RefreshCcw, titleKey: 'home.reasons.easyReturns.title', descriptionKey: 'home.reasons.easyReturns.description' },
];

export default function ShopHome({
    auth,
    products,
    themes = [],
    collections = [],
    cart_item_count: cartItemCount,
    hero_badge,
    hero_title,
    hero_subtitle,
}) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    const [addingProductId, setAddingProductId] = useState(null);
    const featuredTrackRef = useRef(null);
    const mobileFeaturedTrackRef = useRef(null);
    const arrivalsTrackRef = useRef(null);

    const productRows = products?.data ?? [];
    const featuredProducts = productRows.slice(0, 4);
    const arrivals = productRows.slice(0, 4);
    const showThemesSection = themes.length > 0;
    const showCollectionsSection = collections.length > 0;

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

    function scrollCarousel(ref, direction) {
        if (!ref.current) {
            return;
        }

        const firstCard = ref.current.querySelector('article');
        const cardWidth = firstCard?.getBoundingClientRect().width ?? 280;
        const computedStyle = window.getComputedStyle(ref.current);
        const gap = Number.parseFloat(computedStyle.columnGap || computedStyle.gap || '16');
        const nextPosition = ref.current.scrollLeft + direction * (cardWidth + gap);

        ref.current.scrollTo({
            left: nextPosition,
            behavior: 'smooth',
        });
    }

    function renderProductCard(product) {
        const isOutOfStock = product.stock_quantity < 1;
        const isAdding = addingProductId === product.id;

        return (
            <article
                key={product.id}
                className="relative group min-w-[80vw] max-w-[80vw] flex-shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-border/90 bg-card p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-[280px] sm:max-w-[280px]"
            >
                <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />

                <div className="relative overflow-hidden rounded-[1.25rem] bg-muted/80">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="aspect-[4/5] w-full object-cover opacity-100 transition-all duration-500 group-hover:scale-[1.04]" />
                    ) : (
                        <div className="flex aspect-[4/5] items-center justify-center text-sm text-muted-foreground">{t('home.featuredProductImage')}</div>
                    )}
                    <button type="button" className="absolute right-3 top-3 z-10 rounded-full border border-white/40 bg-white/80 p-2 text-foreground backdrop-blur transition hover:bg-white" aria-label={`Add ${product.name} to wishlist`}>
                        <Heart className="h-4 w-4" />
                    </button>
                </div>

                <div className="relative z-10 px-1 pb-1 pt-4">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{product.category_name ?? t('home.signatureCap')}</p>
                        <span className="rounded-full bg-muted/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/80">
                            {isOutOfStock ? t('home.soldOut') : t('home.inStock')}
                        </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
                        <span>{t('home.productColors')}</span>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3">
                        <p className="text-lg font-black">{formatMad(product.price_mad)}</p>
                        <button type="button" disabled={isOutOfStock || isAdding} onClick={() => addToCart(product)} className="relative z-20 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:bg-foreground/40">
                            {isAdding ? t('common.saving') : t('home.quickAdd')}
                        </button>
                    </div>
                </div>
            </article>
        );
    }

    const reasons_with_keys = reasons.map((reason, idx) => ({
        ...reason,
        _uniqueId: `reason-${idx}`,
    }));

    return (
        <>
            <Head title="Streetwear Cap | Streetwear Cap" />

            <style>{`
                html, body {
                    scroll-behavior: smooth;
                    overflow-x: hidden;
                    min-height: 100vh;
                    height: auto;
                }

                .carousel-track {
                    scroll-padding-inline: 0.25rem;
                    scroll-snap-type: x mandatory;
                    overscroll-behavior-x: contain;
                    touch-action: pan-y pan-x;
                }

                .carousel-track::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <main className="min-h-screen w-full overflow-y-auto bg-[#f7f5f1] text-foreground dark:bg-[#111111] dark:text-white">
                <ShopNavigation auth={auth} cartItemCount={cartItemCount} />

                <section className="relative overflow-hidden border-b border-border bg-[#f3efe8] bg-cover bg-top-right sm:bg-center bg-no-repeat dark:bg-[#111111]" style={{ backgroundImage: "url('/images/bg-images-ans.png')" }}>
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/20" />
                    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="flex flex-col justify-center">
                            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/90 backdrop-blur">
                                <span>{hero_badge}</span>
                            </div>

                            <h1
                                style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }}
                                className="max-w-3xl text-5xl leading-[0.9] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl"
                            >
                                {hero_title}
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                                {hero_subtitle}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
                                    {t('nav.shopNow')}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link href="/collections" className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                                    {t('nav.exploreCollection')}
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-6 text-sm text-white/80">
                                <div>
                                    <p className="font-semibold text-white">{t('home.premiumFit')}</p>
                                    <p>{t('home.editorialSilhouettes')}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{t('home.limitedDrops')}</p>
                                    <p>{t('home.newEverySeason')}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{t('home.cashOnDelivery')}</p>
                                    <p>{t('common.builtForMorocco')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MOBILE-ONLY FEATURED PRODUCTS SECTION (Appears immediately below hero on mobile screens) */}
                <section className="block sm:hidden mx-auto max-w-7xl px-4 py-6">
                    <div className="mb-6 flex flex-col gap-3">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('home.featuredProducts')}</p>
                            <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-3xl font-black">{t('home.modernEssentials')}</h2>
                        </div>
                    </div>

                    {featuredProducts.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
                            <h3 className="text-lg font-bold">{t('home.noProducts')}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{t('home.noProductsCopy')}</p>
                        </div>
                    ) : (
                        <div ref={mobileFeaturedTrackRef} className="carousel-track flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {featuredProducts.map((product) => renderProductCard(product))}
                        </div>
                    )}
                </section>

                {showThemesSection ? (
                    <section id="collections" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">Collections</p>
                                <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-3xl font-black sm:text-4xl">Designed for every mood</h2>
                            </div>
                            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{t('home.collectionsCopy')}</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                            {themes.map((theme) => (
                                <div key={theme.id} className="group overflow-hidden rounded-[1.5rem] border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <div className={`h-24 rounded-[1rem] overflow-hidden bg-gradient-to-br ${theme.accent}`}>
                                        {theme.image_url ? (
                                            <img src={theme.image_url} alt={theme.title} className="h-full w-full object-cover" />
                                        ) : null}
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">{theme.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{theme.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}

                {showCollectionsSection ? (
                    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                        <div className="grid gap-4 lg:grid-cols-3">
                            {collections.map((collection) => (
                                <div key={collection.id} className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 transition duration-300 hover:-translate-y-1">
                                    {collection.image_url && (
                                        <img src={collection.image_url} alt={collection.title} className="absolute inset-0 h-full w-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/20 to-transparent" />
                                    <div className="relative flex min-h-[320px] flex-col justify-end rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(0,0,0,0.35))] p-6">
                                        <p className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur">{collection.badge}</p>
                                        <h3 className="text-2xl font-black text-white">{collection.title}</h3>
                                        <p className="mt-2 max-w-sm text-sm leading-7 text-white/80">{collection.subtitle}</p>
                                        <Link href={`/collections/${collection.id}`} className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white">
                                            {t('nav.viewCollection')}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}

                {/* DESKTOP-ONLY FEATURED PRODUCTS SECTION (Completely untouched for PC) */}
                <section id="collection" className="hidden sm:block mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('home.featuredProducts')}</p>
                            <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-3xl font-black sm:text-4xl">{t('home.modernEssentials')}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => scrollCarousel(featuredTrackRef, -1)} className="rounded-full border border-border bg-background/80 p-2 text-foreground transition hover:bg-muted" aria-label="Scroll featured products left">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => scrollCarousel(featuredTrackRef, 1)} className="rounded-full border border-border bg-background/80 p-2 text-foreground transition hover:bg-muted" aria-label="Scroll featured products right">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {featuredProducts.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
                            <h3 className="text-lg font-bold">{t('home.noProducts')}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{t('home.noProductsCopy')}</p>
                        </div>
                    ) : (
                        <div ref={featuredTrackRef} className="carousel-track flex gap-4 overflow-x-auto pb-4 pl-0 pr-0 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {featuredProducts.map((product) => renderProductCard(product))}
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
                            <p style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('home.newArrivals')}</p>
                            <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-3xl font-black sm:text-4xl">{t('home.freshFromStudio')}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => scrollCarousel(arrivalsTrackRef, -1)} className="rounded-full border border-border bg-background/80 p-2 text-foreground transition hover:bg-muted" aria-label="Scroll new arrivals left">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => scrollCarousel(arrivalsTrackRef, 1)} className="rounded-full border border-border bg-background/80 p-2 text-foreground transition hover:bg-muted" aria-label="Scroll new arrivals right">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div ref={arrivalsTrackRef} className="carousel-track flex gap-4 overflow-x-auto pb-4 pl-0 pr-0 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {arrivals.map((product) => renderProductCard(product))}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {reasons_with_keys.map((reason) => {
                            const Icon = reason.icon;
                            return (
                                <div 
                                    key={reason._uniqueId} 
                                    className="group relative overflow-hidden rounded-[1.5rem] border border-border/60 bg-gradient-to-br from-card via-card to-card/95 p-6 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-foreground/30 hover:shadow-lg"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                                    
                                    <div className="relative">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border/40 bg-gradient-to-br from-muted via-muted to-muted/80 text-foreground shadow-sm ring-1 ring-primary/20 transition duration-300 group-hover:ring-primary/40 group-hover:shadow-md group-hover:scale-110">
                                            <Icon className="h-7 w-7 transition duration-300 group-hover:text-primary" />
                                        </div>
                                        
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
                            <p style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-lg font-black uppercase tracking-[0.28em] text-foreground">Streetwear Cap</p>
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