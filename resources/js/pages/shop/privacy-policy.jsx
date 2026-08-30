import { Head, Link } from '@inertiajs/react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

export default function PrivacyPolicy({ auth }) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    return (
        <>
            <Head title={t('privacyPolicy.title')} />

            <main className="min-h-screen bg-[#f7f5f1] text-foreground dark:bg-[#111111] dark:text-white">
                <ShopNavigation auth={auth} cartItemCount={0} />

                <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mb-8 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">{t('privacyPolicy.label')}</p>
                        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">{t('privacyPolicy.headline')}</h1>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                        <div className="space-y-6 text-base leading-8 text-muted-foreground">
                            <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4">
                                <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-foreground" />
                                <p>{t('privacyPolicy.paragraph1')}</p>
                            </div>

                            <p>{t('privacyPolicy.paragraph2')}</p>

                            <p>{t('privacyPolicy.paragraph3')}</p>

                            <div className="rounded-2xl border border-border bg-background/60 p-5">
                                <div className="mb-3 flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-foreground" />
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">{t('privacyPolicy.howWeUseTitle')}</h2>
                                </div>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>{t('privacyPolicy.bullet1')}</li>
                                    <li>{t('privacyPolicy.bullet2')}</li>
                                    <li>{t('privacyPolicy.bullet3')}</li>
                                </ul>
                            </div>

                            <p>{t('privacyPolicy.paragraph4')}</p>
                        </div>
                    </div>

                    <div className="mt-8 text-sm text-muted-foreground">
                        <Link href="/products" className="font-semibold text-foreground underline decoration-foreground/40 underline-offset-4">
                            {t('privacyPolicy.backToShopping')}
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
