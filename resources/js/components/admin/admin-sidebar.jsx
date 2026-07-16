import { Link } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

const navigation = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Categories', href: '/admin/categories' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Themes', href: '/admin/themes' },
    { label: 'Collections', href: '/admin/collections' },
    { label: 'Delivery zones', href: '/admin/delivery-zones' },
];

export default function AdminSidebar({ currentPath = '/admin' }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const activePath = currentPath || '/admin';
    const nextAppearance = resolvedAppearance === 'dark' ? 'light' : 'dark';
    const ThemeIcon = resolvedAppearance === 'dark' ? Sun : Moon;

    return (
        <aside className="hidden w-72 shrink-0 flex-col border-l border-border bg-card/70 p-6 text-card-foreground shadow-sm lg:flex">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Morocco Shop
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                    Admin navigation
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Access the catalog, delivery, and order workflow from one place.
                </p>
            </div>

            <button
                type="button"
                onClick={() => updateAppearance(nextAppearance)}
                className="mt-8 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
                <span className="flex items-center gap-2">
                    <ThemeIcon className="h-4 w-4" />
                    {resolvedAppearance === 'dark' ? 'Light mode' : 'Dark mode'}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Theme</span>
            </button>

            <nav className="mt-4 space-y-2">
                {navigation.map((item) => {
                    const isActive =
                        activePath === item.href ||
                        (item.href !== '/admin' &&
                            activePath.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <span>{item.label}</span>
                            <span className="text-xs opacity-70">→</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Quick access</p>
                <p className="mt-2">
                    Switch themes or jump back to the storefront whenever you need.
                </p>
                <Link href="/" className="mt-3 inline-flex rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                    View shop
                </Link>
            </div>
        </aside>
    );
}
