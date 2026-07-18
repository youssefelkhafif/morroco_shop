import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Heart, PackageCheck, RefreshCcw, Sparkles, Truck } from 'lucide-react';
import { useState } from 'react';
import ShopNavigation from '@/components/shop-navigation';

const formatMad = (value) =>
    new Intl.NumberFormat('en-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
    }).format(Number(value));

const reasons = [
    { icon: BadgeCheck, title: 'Premium Materials', description: 'Refined textures and long-wear construction.' },
    { icon: PackageCheck, title: 'Cash on Delivery', description: 'Secure ordering with flexible checkout.' },
    { icon: Truck, title: 'Fast Shipping', description: 'Reliable dispatch across Morocco.' },
    { icon: RefreshCcw, title: 'Easy Returns', description: 'Simple support for a stress-free experience.' },
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

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation auth={auth} cartItemCount={cartItemCount} />

                <section className="relative overflow-hidden border-b border-border bg-cover bg-top-right sm:bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/bg-images-ans.png')" }}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="flex flex-col justify-center">
                            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/90 backdrop-blur">
                                {/* <Sparkles className="h-3.5 w-3.5" /> */}
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
                                <Link href="/collections" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
                                    Shop now
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link href="#collections" className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                                    Explore collection
                                </Link>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-6 text-sm text-white/80">
                                <div>
                                    <p className="font-semibold text-white">Premium fit</p>
                                    <p>Editorial silhouettes</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Limited drops</p>
                                    <p>New every season</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Cash on delivery</p>
                                    <p>Built for Morocco</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="collections" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">Collections</p>
                            <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-3xl font-black sm:text-4xl">Designed for every mood</h2>
                        </div>
                        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">A premium structure built to grow from caps into a wider fashion universe without losing its identity.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                        {themes.length === 0 ? (
                            <div className="col-span-full rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                                <p className="text-sm text-muted-foreground">No themes available. Add themes from the admin panel.</p>
                            </div>
                        ) : (
                            themes.map((theme) => (
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
                            ))
                        )}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {collections.length === 0 ? (
                            <div className="col-span-full rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                                <p className="text-sm text-muted-foreground">No collections available. Add collections from the admin panel.</p>
                            </div>
                        ) : (
                            collections.map((collection) => (
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
                                            View collection
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section id="collection" className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">Featured products</p>
                            <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-3xl font-black sm:text-4xl">Modern essentials, built to last</h2>
                        </div>
                    </div>

                    {featuredProducts.length === 0 ? (
                        <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
                            <h3 className="text-lg font-bold">No products available yet</h3>
                            <p className="mt-2 text-sm text-muted-foreground">The shop owner will add products soon.</p>
                        </div>
                    ) : (
                        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory touch-pan-x">
                            {featuredProducts.map((product) => {
                                const isOutOfStock = product.stock_quantity < 1;
                                const isAdding = addingProductId === product.id;

                                return (
                                    <article key={product.id} className="relative group min-w-[270px] max-w-[270px] flex-shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-border bg-card p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-w-[290px] sm:max-w-[290px]">
                                        <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
                                        <div className="relative overflow-hidden rounded-[1.25rem] bg-muted/80">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                                            ) : (
                                                <div className="flex aspect-[4/5] items-center justify-center text-sm text-muted-foreground">No product image</div>
                                            )}
                                            <button type="button" className="absolute right-3 top-3 z-10 rounded-full border border-white/40 bg-white/80 p-2 text-foreground backdrop-blur transition hover:bg-white" aria-label={`Add ${product.name} to wishlist`}>
                                                <Heart className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="relative z-10 px-1 pb-1 pt-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{product.category_name ?? 'Signature'}</p>
                                                <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{isOutOfStock ? 'Sold out' : 'In stock'}</span>
                                            </div>

                                            <div className="mt-3 block text-lg font-black uppercase tracking-[0.03em] text-foreground">{product.name}</div>

                                            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
                                                <span>Black / Stone / Ivory</span>
                                            </div>

                                            <div className="mt-4 flex items-end justify-between gap-3">
                                                <p className="text-lg font-black">{formatMad(product.price_mad)}</p>
                                                <button type="button" disabled={isOutOfStock || isAdding} onClick={() => addToCart(product)} className="relative z-20 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:bg-foreground/40">
                                                    {isAdding ? 'Adding...' : 'Quick add'}
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
                            <div className="flex flex-col justify-center">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/65">Editorial drop</p>
                                <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Designed for the streets. Built for everyday.</h2>
                                <p className="mt-5 max-w-xl text-base leading-8 text-white/70">Elevated essentials for the city, the studio, and the weekend reset.</p>
                                <Link href="#collection" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                                    Explore collection
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
                                <div className="h-full min-h-[280px] rounded-[1.2rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),rgba(0,0,0,0.7))]" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">New arrivals</p>
                            <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-3xl font-black sm:text-4xl">Fresh from the studio</h2>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory touch-pan-x">
                        {arrivals.map((product) => (
                            <div key={product.id} className="relative group cursor-pointer min-w-[270px] max-w-[270px] flex-shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-border bg-card p-3 transition duration-300 hover:-translate-y-1 sm:min-w-[290px] sm:max-w-[290px]">
                                <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
                                <div className="overflow-hidden rounded-[1.15rem] bg-muted/70">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                                    ) : (
                                        <div className="flex aspect-[4/5] items-center justify-center text-sm text-muted-foreground">Preview</div>
                                    )}
                                </div>
                                        <div className="relative z-20 mt-4 px-1 pb-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link href={`/products/${product.id}`} className="text-sm font-semibold text-foreground hover:text-muted-foreground">{product.name}</Link>
                                        <p className="text-sm font-semibold">{formatMad(product.price_mad)}</p>
                                    </div>
                                    <button type="button" onClick={() => addToCart(product)} className="relative z-20 mt-4 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted">
                                        Quick add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {reasons.map((reason) => {
                            const Icon = reason.icon;
                            return (
                                <div key={reason.title} className="rounded-[1.5rem] border border-border bg-card p-6 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold">{reason.title}</h3>
                                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{reason.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-border bg-card px-6 py-12 text-center sm:px-10 lg:px-16">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">Stay close</p>
                        <h2 className="mt-3 text-3xl font-black sm:text-4xl">Join the next drop</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">Receive early access, launch notes, and limited edition updates directly in your inbox.</p>
                        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                            <input type="email" placeholder="Email address" className="h-12 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none ring-0 focus:border-foreground" />
                            <button type="button" className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Subscribe</button>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-border bg-card/70">
                    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
                        <div>
                            <p style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }}  className="text-lg font-black uppercase tracking-[0.28em] text-foreground">Streetwear Cap</p>
                            <p className="mt-3 max-w-sm leading-7">Minimal luxury for everyday wear, crafted for a new generation of streetwear lovers.</p>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-3">
                            <div>
                                <p className="font-semibold text-foreground">Collections</p>
                                <ul className="mt-3 space-y-2">
                                    <li><Link href="#collections" className="hover:text-foreground">Caps</Link></li>
                                    <li><Link href="#collections" className="hover:text-foreground">Snapbacks</Link></li>
                                    <li><Link href="#collections" className="hover:text-foreground">Limited</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Support</p>
                                <ul className="mt-3 space-y-2">
                                    <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                                    <li><Link href="/cart" className="hover:text-foreground">Cart</Link></li>
                                    <li><Link href="/notification" className="hover:text-foreground">Orders</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Company</p>
                                <ul className="mt-3 space-y-2">
                                    <li><a href="mailto:hello@streetwearcaps.com" className="hover:text-foreground">Contact</a></li>
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