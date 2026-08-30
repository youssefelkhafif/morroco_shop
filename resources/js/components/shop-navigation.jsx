import { Link, router, usePage } from '@inertiajs/react';
import { Bell, ChevronRight, CircleUserRound, Home, Info, LogOut, MoonStar, Package, Phone, Settings, ShieldCheck, ShoppingBag, ShoppingCart, Sun, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/context/appContext';
import { useAppearance } from '@/hooks/use-appearance';
import { resolveTranslation } from '@/lib/translations';

const mainLinks = [
    { labelKey: 'nav.home', href: '/', icon: Home },
    { labelKey: 'nav.shop', href: '/products', icon: ShoppingBag },
    { labelKey: 'nav.cart', href: '/cart', icon: ShoppingCart },
    { labelKey: 'nav.orders', href: '/notification', icon: Package },
];

const guestMainLinks = [
    { labelKey: 'nav.home', href: '/', icon: Home },
    { labelKey: 'nav.shop', href: '/products', icon: ShoppingBag },
    { labelKey: 'nav.cart', href: '/cart', icon: ShoppingCart },
];

const accountLinks = [
    { labelKey: 'nav.settings', href: '/settings', icon: Settings },
];

const infoLinks = [
    { labelKey: 'nav.about', href: '/about', icon: Info },
    { labelKey: 'nav.contact', href: '/contact', icon: Phone },
];

const secondaryNavItems = [
    { labelKey: 'nav.home', href: '/' },
    { labelKey: 'nav.shop', href: '/products' },
    { labelKey: 'nav.orders', href: '/notification' },
    { labelKey: 'nav.cart', href: '/cart' },
    { labelKey: 'nav.about', href: '/about' },
    { labelKey: 'nav.contact', href: '/contact' },
];

export default function ShopNavigation({ auth, cartItemCount }) {
    const { selectedLanguage, setSelectedLanguage } = useAppContext();
    const { notifications } = usePage().props;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [isAllRead, setIsAllRead] = useState(false);
    const languageToggleRef = useRef(null);

    const t = (key, fallback = key) => resolveTranslation(selectedLanguage, key, fallback);
    const unreadCount = notifications?.unread_count ?? 0;
    const latestNotifications = notifications?.latest ?? [];
    const visibleNotifications = isAllRead ? [] : latestNotifications;

    const handleMarkAllRead = () => {
        router.post('/notification/mark-all-read', {
            preserveScroll: true,
            onSuccess: () => {
                setIsAllRead(true);
                setIsNotificationsOpen(false);
                router.reload({ only: ['notifications'] });
            },
        });
    };

    const isAuthenticated = Boolean(auth?.user);
    const isDarkMode = resolvedAppearance === 'dark';
    const visibleSecondaryNavItems = isAuthenticated
        ? secondaryNavItems
        : secondaryNavItems.filter((item) => item.labelKey !== 'nav.orders');
    const navSurface = isDarkMode ? 'border-white/10 bg-[#111111]/95 text-white' : 'border-black/10 bg-background/95 text-foreground';
    const navLinkClass = isDarkMode ? 'text-white/75 hover:text-white hover:bg-white/5' : 'text-black/70 hover:text-black hover:bg-black/5';
    const roleLabel = auth?.user?.is_admin ? t('nav.admin') : t('nav.customer');
    const displayName = auth?.user?.name || t('nav.guest');
    const displayEmail = auth?.user?.email || t('nav.signInToContinue');
    const sidebarMainLinks = isAuthenticated ? mainLinks : guestMainLinks;
    const showAdminSection = isAuthenticated && auth?.user?.is_admin;
    const showAccountSection = isAuthenticated;
    const showInfoSection = true;
    const showThemeCard = true;
    const drawerSurface = isDarkMode ? 'bg-[#111111] text-white border-white/10' : 'bg-[#f7f6f1] text-black border-black/10';
    const headerSurface = isDarkMode ? 'bg-[#1b1b1b] border-white/10' : 'bg-white border-black/10';
    const mutedText = isDarkMode ? 'text-white/60' : 'text-black/60';
    const subText = isDarkMode ? 'text-white/40' : 'text-black/40';
    const interactiveRow = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5';
    const sectionSurface = isDarkMode ? 'bg-[#191919] border-white/10' : 'bg-[#f1f1ee] border-black/10';

    useEffect(() => {
        if (!isDrawerOpen) {
            return undefined;
        }

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsDrawerOpen(false);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isDrawerOpen]);

    useEffect(() => {
        if (!isLanguageOpen) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (languageToggleRef.current && !languageToggleRef.current.contains(event.target)) {
                setIsLanguageOpen(false);
            }
        };

        const handleKeydown = (event) => {
            if (event.key === 'Escape') {
                setIsLanguageOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [isLanguageOpen]);

    return (
        <>
            <header className="sticky top-0 z-30 border-b border-black/10 bg-background/90 backdrop-blur">
                <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 py-2 sm:px-6 lg:px-8">
                    <Link href="/" className="min-w-0 text-[0.72rem] font-black uppercase tracking-[0.2em] text-foreground sm:text-base sm:tracking-[0.28em]">
                        <span className="block truncate" style={{ fontFamily: '"Bodoni Moda", serif' }}>Streetwear Cap</span>
                    </Link>

                    <div className="flex items-center justify-center bg-transparent border-none">
                        {resolvedAppearance === 'dark' ? (
                            <img
                                src="/images/anas-logo-white.png"
                                alt="Streetwear Caps logo white"
                                className="h-8 w-auto object-contain bg-transparent sm:h-10"
                                style={{ backgroundColor: 'transparent' }}
                            />
                        ) : (
                            <img
                                src="/images/anas_logo.png"
                                alt="Streetwear Caps logo"
                                className="h-8 w-auto object-contain bg-transparent sm:h-10"
                                style={{ backgroundColor: 'transparent' }}
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        <div ref={languageToggleRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setIsLanguageOpen((open) => !open)}
                                className={`inline-flex items-center justify-center rounded-full border px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition sm:px-4 sm:py-2 sm:text-[11px] ${isDarkMode ? 'border-white/10 bg-[#111111] text-white' : 'border-black/10 bg-white text-black'} ${isLanguageOpen ? (isDarkMode ? 'shadow-[0_15px_40px_rgba(255,255,255,0.08)]' : 'shadow-[0_15px_40px_rgba(0,0,0,0.08)]') : ''}`}
                                aria-haspopup="menu"
                                aria-expanded={isLanguageOpen}
                            >
                                <span className="text-[10px] tracking-[0.3em] text-current opacity-80">LG</span>
                                <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.22em] sm:ml-2 sm:text-[11px]">
                                    {selectedLanguage === 'fr' ? 'FR' : 'EN'}
                                </span>
                            </button>

                            {isLanguageOpen && (
                                <div className={`absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-[1.5rem] border ${isDarkMode ? 'border-white/10 bg-[#111111] text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]' : 'border-black/10 bg-white text-black shadow-[0_24px_80px_rgba(0,0,0,0.12)]'}`}>
                                    {[
                                        { value: 'en', label: 'English' },
                                        { value: 'fr', label: 'Français' },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                setSelectedLanguage(option.value);
                                                setIsLanguageOpen(false);
                                            }}
                                            className={`w-full px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.18em] transition ${selectedLanguage === option.value ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black') : (isDarkMode ? 'text-white/70 hover:bg-white/5 hover:text-white' : 'text-black/70 hover:bg-black/5 hover:text-black')}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            aria-label={t('nav.themeToggle')}
                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-background text-foreground transition hover:bg-foreground/10 sm:h-10 sm:w-10"
                        >
                            {resolvedAppearance === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                        </button>

                        <button
                            type="button"
                            aria-label={t('nav.notificationsToggle')}
                            onClick={() => {
                                setIsLanguageOpen(false);
                                setIsNotificationsOpen((open) => !open);
                            }}
                            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-background text-foreground transition hover:bg-foreground/10 sm:h-10 sm:w-10"
                        >
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            aria-label={t('nav.accountMenu')}
                            onClick={() => {
                                setIsLanguageOpen(false);
                                setIsNotificationsOpen(false);
                                setIsDrawerOpen(true);
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-foreground text-background transition hover:scale-[1.02] sm:h-10 sm:w-10"
                        >
                            {isAuthenticated ? <CircleUserRound className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <nav className={`hidden border-b backdrop-blur md:block ${navSurface}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
                    {visibleSecondaryNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition sm:text-[11px] ${navLinkClass}`}
                        >
                            {t(item.labelKey)}
                        </Link>
                    ))}
                </div>
            </nav>

            {isNotificationsOpen && (
                <div className="fixed inset-x-0 top-16 z-[40] mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-sm rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-black">{t('nav.notifications')}</p>
                                <p className="text-xs text-black/60">Fresh updates for your shop journey</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNotificationsOpen(false)}
                                className="rounded-full p-1 text-black/60 hover:bg-black/5 hover:text-black"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {visibleNotifications.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-black/10 bg-[#f7f6f1] px-4 py-6 text-center text-sm text-black/60">
                                    {t('common.allCaughtUp')}
                                </div>
                            ) : (
                                visibleNotifications.map((notification) => (
                                    <div key={notification.id} className="rounded-2xl border border-black/10 bg-[#f7f6f1] p-3">
                                        <p className="text-sm font-semibold text-black">{notification.message}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                className="text-sm font-semibold text-black/70 transition hover:text-black"
                            >
                                {t('nav.allRead')}
                            </button>
                            <Link href="/notification" className="text-sm font-semibold text-black transition hover:text-black/70">
                                {t('nav.viewAll')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className={`fixed inset-0 z-[50] transition ${isDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <button
                    type="button"
                    aria-label={t('nav.close')}
                    className={`absolute inset-0 bg-black/45 transition ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsDrawerOpen(false)}
                />

                <aside
                    className={`absolute right-0 top-0 flex h-full w-[min(92vw,360px)] flex-col border-l shadow-[0_20px_80px_rgba(0,0,0,0.16)] transition-transform duration-300 ${drawerSurface} ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className={`flex items-start justify-between border-b px-5 py-5 ${headerSurface}`}>
                        <div className="flex items-center gap-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                <UserRound className="h-5 w-5" />
                            </div>
                            <div>
                                <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{displayName}</p>
                                <p className={`text-xs ${mutedText}`}>{displayEmail}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label={t('nav.close')}
                            onClick={() => setIsDrawerOpen(false)}
                            className={`rounded-full p-2 transition ${isDarkMode ? 'text-white/70 hover:bg-white/5 hover:text-white' : 'text-black/60 hover:bg-black/5 hover:text-black'}`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {isAuthenticated && (
                        <div className={`flex items-center gap-3 border-b px-5 py-4 ${sectionSurface}`}>
                            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${isDarkMode ? 'border-white/10 bg-[#1d1d1d] text-white/80' : 'border-black/10 bg-white text-black/70'}`}>
                                {roleLabel}
                            </span>
                            <span className={`text-sm ${mutedText}`}>{t('nav.premiumAccess')}</span>
                        </div>
                    )}

                    {showThemeCard && (
                        <div className={`mx-4 mt-4 rounded-2xl border p-2 ${sectionSurface}`}>
                            <div className="flex items-center justify-between">
                                <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subText}`}>{t('nav.theme')}</p>
                                <div className="flex items-center gap-2">
                                    {['light', 'dark'].map((mode) => {
                                        const isSelected = (mode === 'light' && !isDarkMode) || (mode === 'dark' && isDarkMode);
                                        return (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => updateAppearance(mode)}
                                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${isSelected
                                                    ? isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
                                                    : isDarkMode ? 'bg-[#232323] text-white/70' : 'bg-white text-black/70 border border-black/10'}`}
                                            >
                                                {mode === 'light' ? t('nav.white') : t('nav.black')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="space-y-2">
                            <p className={`px-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${subText}`}>{t('nav.main')}</p>
                            {sidebarMainLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsDrawerOpen(false)}
                                        className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${interactiveRow}`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            {t(item.labelKey)}
                                        </span>
                                        <ChevronRight className={`h-4 w-4 ${subText}`} />
                                    </Link>
                                );
                            })}
                        </div>

                        {showAdminSection && (
                            <div className="mt-6 space-y-2">
                                <p className={`px-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${subText}`}>{t('nav.admin')}</p>
                                <Link
                                    href="/admin"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${interactiveRow}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <ShieldCheck className="h-4 w-4" />
                                        {t('nav.adminDashboard')}
                                    </span>
                                    <ChevronRight className={`h-4 w-4 ${subText}`} />
                                </Link>
                            </div>
                        )}

                        {showAccountSection && (
                            <div className="mt-6 space-y-2">
                                <p className={`px-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${subText}`}>{t('nav.account')}</p>
                                {accountLinks.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsDrawerOpen(false)}
                                            className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${interactiveRow}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon className="h-4 w-4" />
                                                {t(item.labelKey)}
                                            </span>
                                            <ChevronRight className={`h-4 w-4 ${subText}`} />
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {showInfoSection && (
                            <div className="mt-6 space-y-2">
                                <p className={`px-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${subText}`}>{t('nav.information')}</p>
                                {infoLinks.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            target={item.href.startsWith('mailto:') ? '_self' : '_self'}
                                            rel="noreferrer"
                                            className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${interactiveRow}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon className="h-4 w-4" />
                                                {t(item.labelKey)}
                                            </span>
                                            <ChevronRight className={`h-4 w-4 ${subText}`} />
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className={`border-t border-black/10 p-4 ${isDarkMode ? 'bg-[#141414]' : 'bg-[#f7f6f1]'}`}>
                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <LogOut className="h-4 w-4" />
                                {t('nav.logout')}
                            </button>
                        ) : (
                            <div className="grid gap-2">
                                <Link
                                    href="/login"
                                    className={`flex items-center justify-center rounded-full border px-4 py-3 text-sm font-semibold transition ${isDarkMode ? 'border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800' : 'border-zinc-300 bg-white text-black hover:bg-zinc-100'}`}
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className={`flex items-center justify-center rounded-full border px-4 py-3 text-sm font-semibold transition ${isDarkMode ? 'border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700' : 'border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800'}`}
                                >
                                    {t('auth.register')}
                                </Link>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </>
    );
}
