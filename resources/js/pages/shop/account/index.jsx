import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ShopNavigation from '@/components/shop-navigation';
import { useAppContext } from '@/context/appContext';
import { resolveTranslation } from '@/lib/translations';

export default function AccountIndex({ auth }) {
    const { selectedLanguage } = useAppContext();
    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    const { notifications } = usePage().props;
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const unreadCount = notifications?.unread_count ?? 0;
    const latestNotifications = notifications?.latest ?? [];

    return (
        <>
            <Head title={t('account.title')} />

            <ShopNavigation auth={auth} cartItemCount={0} />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black">
                                {t('dashboardWelcome').replace('{name}', auth?.user?.name ?? '')}
                            </h1>

                            <p className="mt-3 text-slate-600">
                                {t('dashboardCopy')}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsNotificationsOpen((open) => !open)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:border-slate-500"
                        >
                            <span className="text-xl">{t('nav.notifications')}</span>
                            {unreadCount > 0 && (
                                <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-emerald-600 px-2 text-xs font-semibold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {isNotificationsOpen && (
                        <section className="mb-6 rounded-3xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">{t('nav.notifications')}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {t('notificationsCopy')}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsNotificationsOpen(false)}
                                    className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                                >
                                    {t('nav.close')}
                                </button>
                            </div>

                            {latestNotifications.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                    {t('noNewNotifications')}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {latestNotifications.map((notification) => (
                                        <article
                                            key={notification.id}
                                            className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
                                        >
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {notification.message}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    <div className="space-y-6">
                        <section className="rounded-xl border border-border bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{t('overviewTitle')}</h2>
                            <p className="mt-3 text-slate-600 dark:text-slate-400">
                                {t('overviewCopy')}
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}
