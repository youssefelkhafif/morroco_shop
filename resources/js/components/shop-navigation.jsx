import { Link, router, usePage } from '@inertiajs/react';
import { Bell, ChevronRight, CircleUserRound, Home, Info, KeyRound, LogOut, MoonStar, Package, Phone, RotateCcw, Settings, ShieldCheck, ShoppingBag, ShoppingCart, Sparkles, Sun, Truck, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

const mainLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/products', icon: ShoppingBag },
    { label: 'Cart', href: '/cart', icon: ShoppingCart },
    { label: 'Orders', href: '/notification', icon: Package },
];

const accountLinks = [
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'My Profile', href: '/settings', icon: UserRound },
    { label: 'Change Password', href: '/settings', icon: KeyRound },
];

const infoLinks = [
    { label: 'About Us', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: Phone },
    { label: 'Shipping Policy', href: '/about', icon: Truck },
    { label: 'Return Policy', href: '/about', icon: RotateCcw },
    { label: 'Privacy Policy', href: '/about', icon: ShieldCheck },
];

export default function ShopNavigation({ auth, cartItemCount }) {
    const { notifications } = usePage().props;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isAllRead, setIsAllRead] = useState(false);

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
    const roleLabel = auth?.user?.is_admin ? 'Admin' : 'Customer';
    const displayName = auth?.user?.name || 'Guest';
    const displayEmail = auth?.user?.email || 'Sign in to continue';

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

    return (
        <>
            <header className="sticky top-0 z-30 border-b border-black/10 bg-background/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 text-base font-black uppercase tracking-[0.28em] text-foreground">
                        {/* <Sparkles className="h-4 w-4" /> */}
                        <span style={{ fontFamily: '"Bodoni Moda", serif' }}>Streetwear Cap</span>
                    </Link>

                    <div className="flex items-center justify-center bg-transparent border-none">
                        {resolvedAppearance === 'dark' ? (
                            <img
                                src="/images/anas-logo-white.png"
                                alt="Streetwear Caps logo white"
                                className="h-10 w-auto object-contain bg-transparent"
                                style={{ backgroundColor: 'transparent' }}
                            />
                        ) : (
                            <img
                                src="/images/anas_logo.png"
                                alt="Streetwear Caps logo"
                                className="h-10 w-auto object-contain bg-transparent"
                                style={{ backgroundColor: 'transparent' }}
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Toggle theme"
                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-background text-foreground transition hover:bg-foreground/10"
                        >
                            {resolvedAppearance === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                        </button>

                        <button
                            type="button"
                            aria-label="View notifications"
                            onClick={() => setIsNotificationsOpen((open) => !open)}
                            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-background text-foreground transition hover:bg-foreground/10"
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
                            aria-label="Open account menu"
                            onClick={() => setIsDrawerOpen(true)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-foreground text-background transition hover:scale-[1.02]"
                        >
                            {isAuthenticated ? <CircleUserRound className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {isNotificationsOpen && (
                <div className="fixed inset-x-0 top-16 z-[40] mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-sm rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-black">Notifications</p>
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
                                    You are all caught up.
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
                                Mark all read
                            </button>
                            <Link href="/notification" className="text-sm font-semibold text-black transition hover:text-black/70">
                                View all
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className={`fixed inset-0 z-[50] transition ${isDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <button
                    type="button"
                    aria-label="Close account drawer"
                    className={`absolute inset-0 bg-black/45 transition ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsDrawerOpen(false)}
                />

                <aside
                    className={`absolute right-0 top-0 flex h-full w-[min(92vw,360px)] flex-col border-l border-black/10 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.16)] transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex items-start justify-between border-b border-black/10 px-5 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                                <UserRound className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-black">{displayName}</p>
                                <p className="text-xs text-black/60">{displayEmail}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label="Close account drawer"
                            onClick={() => setIsDrawerOpen(false)}
                            className="rounded-full p-2 text-black/60 transition hover:bg-black/5 hover:text-black"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 border-b border-black/10 bg-[#f7f6f1] px-5 py-4">
                        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/70">
                            {roleLabel}
                        </span>
                        <span className="text-sm text-black/60">Premium account access</span>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <div className="space-y-2">
                            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40">Main</p>
                            {mainLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-black transition hover:bg-black/5"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-black/40" />
                                    </Link>
                                );
                            })}
                        </div>

                        {isAuthenticated && auth?.user?.is_admin && (
                            <div className="mt-6 space-y-2">
                                <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40">Admin</p>
                                <Link
                                    href="/admin"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-black transition hover:bg-black/5"
                                >
                                    <span className="flex items-center gap-3">
                                        <ShieldCheck className="h-4 w-4" />
                                        Admin dashboard
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-black/40" />
                                </Link>
                            </div>
                        )}

                        <div className="mt-6 space-y-2">
                            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40">Account</p>
                            {accountLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-black transition hover:bg-black/5"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-black/40" />
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-6 space-y-2">
                            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40">Information</p>
                            {infoLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target={item.href.startsWith('mailto:') ? '_self' : '_self'}
                                        rel="noreferrer"
                                        className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-black transition hover:bg-black/5"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-black/40" />
                                    </a>
                                );
                            })}
                        </div>

                        <div className="mt-6 rounded-2xl border border-black/10 bg-[#f7f6f1] p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-black">Theme</p>
                                    <p className="text-xs text-black/60">Switch the feeling of the shop</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                    className="rounded-full border border-black/10 bg-white p-2 text-black transition hover:bg-black hover:text-white"
                                >
                                    {resolvedAppearance === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-black/10 p-4">
                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        ) : (
                            <div className="grid gap-2">
                                <Link href="/login" className="flex items-center justify-center rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90">
                                    Login
                                </Link>
                                <Link href="/register" className="flex items-center justify-center rounded-full border border-black/10 px-4 py-3 text-sm font-semibold text-black transition hover:bg-black/5">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </>
    );
}
