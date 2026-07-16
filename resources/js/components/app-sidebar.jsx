import { Link, usePage } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

const publicLinks = [
    { label: 'Shop', href: '/' },
    { label: 'Cart', href: '/cart' },
    { label: 'Track Order', href: '/track-order' },
];

const accountLinks = [
    { label: 'My Account', href: '/dashboard' },
    { label: 'My Orders', href: '/my-orders' },
    { label: 'Settings', href: '/settings/profile' },
];

export default function AppSidebar() {
    const { auth } = usePage().props;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isLoggedIn = Boolean(auth?.user);
    const nextAppearance = resolvedAppearance === 'dark' ? 'light' : 'dark';
    const ThemeIcon = resolvedAppearance === 'dark' ? Sun : Moon;

    return (
        <aside className="flex min-h-screen w-64 flex-col border-r border-border bg-background p-5 text-foreground">
            <Link href="/" className="mb-10 text-xl font-black tracking-tight">
                Morocco Shop
            </Link>

            <nav className="space-y-1">
                <button
                    type="button"
                    onClick={() => updateAppearance(nextAppearance)}
                    className="mb-3 flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                    <span className="flex items-center gap-2">
                        <ThemeIcon className="h-4 w-4" />
                        {resolvedAppearance === 'dark' ? 'Light mode' : 'Dark mode'}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Theme</span>
                </button>

                {auth?.user?.is_admin && (
                    <Link
                        href="/admin"
                        className="mb-3 flex w-full items-center justify-between rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
                    >
                        <span>Admin dashboard</span>
                        <span className="text-xs uppercase tracking-[0.2em]">Go</span>
                    </Link>
                )}
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Shop
                </p>

                {publicLinks.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        {item.label}
                    </Link>
                ))}

                {isLoggedIn && (
                    <>
                        <p className="mb-2 mt-8 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Account
                        </p>

                        {accountLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </>
                )}
            </nav>

            <p className="mt-auto text-xs text-muted-foreground">
                Cash on Delivery · Morocco
            </p>
        </aside>
    );
}
