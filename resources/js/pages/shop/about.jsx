import { Head, Link } from '@inertiajs/react';
import { Instagram, MapPin, ShoppingBag } from 'lucide-react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

export default function About({ auth, shop_instagram }) {
    const instagramHandle = shop_instagram || 'street_wearcap';
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);

    return (
        <>
            <Head title={t('about.title')} />

            <main className="min-h-screen bg-[#f7f5f1] text-foreground dark:bg-[#111111] dark:text-white">
                <ShopNavigation auth={auth} cartItemCount={0} />

                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        <div>
                            <h1 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }}  className="text-5xl font-bold tracking-tight mb-6">
                                {t('about.heroHeadline')}
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {t('about.heroCopy')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Mission */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
                    <div className="grid gap-12 md:grid-cols-2">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">{t('about.missionHeading')}</h2>
                            <p className="leading-relaxed space-y-4 text-muted-foreground">
                                <span className="block">
                                    {t('about.missionCopy1')}
                                </span>
                                <span className="block">
                                    {t('about.missionCopy2')}
                                </span>
                            </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-8">
                            <h3 className="text-2xl font-bold mb-6">{t('about.offerHeading')}</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <ShoppingBag className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold">{t('about.offerItem1Title')}</span>
                                        <p className="text-sm text-muted-foreground">{t('about.offerItem1Copy')}</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <ShoppingBag className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold">{t('about.offerItem2Title')}</span>
                                        <p className="text-sm text-muted-foreground">{t('about.offerItem2Copy')}</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <ShoppingBag className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold">{t('about.offerItem3Title')}</span>
                                        <p className="text-sm text-muted-foreground">{t('about.offerItem3Copy')}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
                    <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }}  className="text-3xl font-bold mb-12 text-center">{t('about.whyTitle')}</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="bg-card p-8 rounded-lg border border-border text-center">
                            <div className="text-4xl mb-4">🇲🇦</div>
                            <h3 className="text-xl font-bold mb-3">{t('about.whyCard1Title')}</h3>
                            <p className="text-muted-foreground">
                                {t('about.whyCard1Copy')}
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-lg border border-border text-center">
                            <div className="text-4xl mb-4">✨</div>
                            <h3 className="text-xl font-bold mb-3">{t('about.whyCard2Title')}</h3>
                            <p className="text-muted-foreground">
                                {t('about.whyCard2Copy')}
                            </p>
                        </div>
                        <div className="bg-card p-8 rounded-lg border border-border text-center">
                            <div className="text-4xl mb-4">💪</div>
                            <h3 className="text-xl font-bold mb-3">{t('about.whyCard3Title')}</h3>
                            <p className="text-muted-foreground">
                                {t('about.whyCard3Copy')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
                    <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-12 text-center">
                        <h2 className="text-3xl font-bold mb-6">{t('about.contactTitle')}</h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            {t('about.contactCopy')}
                        </p>
                        <a
                            href={`https://www.instagram.com/${instagramHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 rounded-lg bg-background px-8 py-3 font-semibold text-foreground transition hover:bg-muted"
                        >
                            <Instagram className="w-5 h-5" />
                            {t('about.followUs').replace('{handle}', instagramHandle)}
                        </a>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-16 border-t border-border bg-card py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{t('about.footerLocation')}</span>
                            </div>
                            <nav className="flex gap-6">
                                <Link href="/" className="text-sm hover:text-muted-foreground">
                                    {t('about.footerShop')}
                                </Link>
                                <Link href="/about" className="text-sm hover:text-muted-foreground">
                                    {t('about.footerAbout')}
                                </Link>
                            </nav>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
