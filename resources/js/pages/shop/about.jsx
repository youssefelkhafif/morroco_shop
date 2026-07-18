import { Head, Link } from '@inertiajs/react';
import { Instagram, MapPin, ShoppingBag } from 'lucide-react';
import ShopNavigation from '@/components/shop-navigation';

export default function About({ auth, shop_instagram }) {
    const instagramHandle = shop_instagram || 'street_wearcap';

    return (
        <>
            <Head title="About Us | Street Wear Cap" />

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation auth={auth} cartItemCount={0} />

                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        <div>
                            <h1 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }}  className="text-5xl font-bold tracking-tight mb-6">
                                About Street Wear Cap
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Welcome to <span className="font-semibold">Street Wear Cap</span> – a premium headwear ecosystem born in <span className="font-semibold">Casablanca, Morocco</span>. We're dedicated to bringing quality streetwear to the people of Morocco and beyond.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Mission */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
                    <div className="grid gap-12 md:grid-cols-2">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="leading-relaxed space-y-4 text-muted-foreground">
                                <span className="block">
                                    At Street Wear Cap, we believe in creating premium quality headwear that celebrates Moroccan culture and global streetwear aesthetics. Our mission is to provide high-quality caps and complementary products that resonate with the modern Moroccan lifestyle.
                                </span>
                                <span className="block">
                                    We're committed to supporting local communities while delivering authentic streetwear experiences to our customers across Morocco.
                                </span>
                            </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-8">
                            <h3 className="text-2xl font-bold mb-6">What We Offer</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <ShoppingBag className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold">Premium Caps</span>
                                        <p className="text-sm text-muted-foreground">High-quality streetwear caps for every style</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <ShoppingBag className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold">Branded Merchandise</span>
                                        <p className="text-sm text-muted-foreground">Exclusive cups and accessories</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <ShoppingBag className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold">Limited Editions</span>
                                        <p className="text-sm text-muted-foreground">Unique drops designed for our community</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
                    <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }}  className="text-3xl font-bold mb-12 text-center">Why Choose Street Wear Cap</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="bg-card p-8 rounded-lg border border-border text-center">
                            <div className="text-4xl mb-4">🇲🇦</div>
                            <h3 className="text-xl font-bold mb-3">Made for Morocco</h3>
                            <p className="text-muted-foreground">
                                We understand the Moroccan market and create products specifically for our community's style and preferences.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-lg border border-border text-center">
                            <div className="text-4xl mb-4">✨</div>
                            <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                            <p className="text-muted-foreground">
                                Every product is carefully selected and crafted to meet the highest standards of streetwear fashion.
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-lg border border-border text-center">
                            <div className="text-4xl mb-4">💪</div>
                            <h3 className="text-xl font-bold mb-3">Community Driven</h3>
                            <p className="text-muted-foreground">
                                We build a strong community of streetwear enthusiasts who share our passion for quality and style.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
                    <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-12 text-center">
                        <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            Join our community and stay updated with the latest drops, events, and exclusive offers.
                        </p>
                        <a
                            href={`https://www.instagram.com/${instagramHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 rounded-lg bg-background px-8 py-3 font-semibold text-foreground transition hover:bg-muted"
                        >
                            <Instagram className="w-5 h-5" />
                            Follow @{instagramHandle}
                        </a>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-16 border-t border-border bg-card py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>Casablanca, Morocco</span>
                            </div>
                            <nav className="flex gap-6">
                                <Link href="/" className="text-sm hover:text-muted-foreground">
                                    Shop
                                </Link>
                                <Link href="/about" className="text-sm hover:text-muted-foreground">
                                    About
                                </Link>
                            </nav>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
