import { Head, Link, router } from '@inertiajs/react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

export default function ShopNotFound({ auth, cart_item_count: cartItemCount = 0 }) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);

    return (
        <>
            <Head title={t('notFound.title')} />

            <main className="min-h-screen bg-[#f7f5f1] text-foreground dark:bg-[#111111] dark:text-white">
                <ShopNavigation auth={auth} cartItemCount={cartItemCount} />

                <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
                    <div className="w-full rounded-[2rem] border border-border bg-card p-10 text-center shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">{t('pageNotFound.errorLabel')}</p>
                        <h1 className="mt-4 text-5xl font-black tracking-tight text-foreground sm:text-6xl">{t('pageNotFound.headline')}</h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
                            {t('pageNotFound.description')}
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                            >
                                {t('pageNotFound.goBack')}
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                            >
                                {t('pageNotFound.goHome')}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
