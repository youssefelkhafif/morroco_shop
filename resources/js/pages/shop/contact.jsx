import { Head, Link } from '@inertiajs/react';
import { Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

export default function Contact({ auth, contact_email, contact_phone }) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    const whatsappNumber = contact_phone?.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hello, I would like to get in touch regarding Street Wear Cap.`;
    const emailLink = `mailto:${contact_email}`;

    return (
        <>
            <Head title={t('contact.title')} />

            <main className="min-h-screen overflow-x-hidden bg-[#f7f5f1] text-foreground dark:bg-[#111111] dark:text-white">
                <ShopNavigation auth={auth} cartItemCount={0} />

                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                    <div className="space-y-8">
                        <div>
                            <h1 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="mb-4 text-4xl font-bold tracking-tight sm:mb-6 sm:text-5xl">
                                {t('contact.heroHeadline')}
                            </h1>
                            <p className="text-base leading-7 text-muted-foreground sm:text-xl sm:leading-relaxed">
                                {t('contact.heroCopy')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="mx-auto max-w-7xl border-t border-black/10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Email Card */}
                        <div className="rounded-lg border border-border bg-card p-5 sm:p-8">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{t('contact.emailTitle')}</h3>
                                    <p className="text-sm text-muted-foreground">{t('contact.emailHelp')}</p>
                                </div>
                            </div>
                            
                            <p className="mb-6 break-all text-xl font-bold sm:text-2xl">{contact_email}</p>
                            
                            <a
                                href={emailLink}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                <Mail className="h-5 w-5" />
                                {t('contact.sendEmail')}
                            </a>
                        </div>

                        {/* WhatsApp Card */}
                        <div className="rounded-lg border border-border bg-card p-5 sm:p-8">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{t('contact.whatsappTitle')}</h3>
                                    <p className="text-sm text-muted-foreground">{t('contact.whatsappHelp')}</p>
                                </div>
                            </div>
                            
                            <p className="mb-6 break-all text-xl font-bold sm:text-2xl">{contact_phone}</p>
                            
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                            >
                                <MessageCircle className="h-5 w-5" />
                                {t('contact.chatOnWhatsApp')}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Additional Info */}
                <section className="mx-auto max-w-7xl border-t border-black/10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="rounded-lg border border-border bg-card p-5 sm:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="h-6 w-6 text-stone-600 dark:text-stone-300" />
                                <h3 className="text-lg font-bold">{t('contact.locationTitle')}</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('contact.locationCopy')}
                            </p>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-5 sm:p-8">
                            <div className="mb-4 flex items-center gap-3">
                                <Clock className="h-6 w-6 text-stone-600 dark:text-stone-300" />
                                <h3 className="text-lg font-bold">{t('contact.responseTitle')}</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('contact.responseCopy')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mx-auto max-w-7xl border-t border-black/10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                    <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">{t('contact.faqTitle')}</h2>
                    
                    <div className="space-y-6">
                        <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                            <h4 className="mb-2 font-bold">{t('contact.faqQuestion1')}</h4>
                            <p className="text-muted-foreground">{t('contact.faqAnswer1')}</p>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                            <h4 className="mb-2 font-bold">{t('contact.faqQuestion2')}</h4>
                            <p className="text-muted-foreground">{t('contact.faqAnswer2')}</p>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                            <h4 className="mb-2 font-bold">{t('contact.faqQuestion3')}</h4>
                            <p className="text-muted-foreground">{t('contact.faqAnswer3')}</p>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                            <h4 className="mb-2 font-bold">{t('contact.faqQuestion4')}</h4>
                            <p className="text-muted-foreground">{t('contact.faqAnswer4')}</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
                    <div className="rounded-lg border border-stone-200 bg-stone-50 p-6 text-center dark:border-stone-800 dark:bg-stone-900 sm:p-8">
                        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{t('contact.ctaTitle')}</h2>
                        <p className="mb-6 text-muted-foreground">{t('contact.ctaCopy')}</p>
                        <Link
                            href="/"
                            className="inline-block rounded-lg bg-stone-950 px-8 py-3 font-bold text-white transition hover:bg-stone-800"
                        >
                            {t('contact.backToShop')}
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
