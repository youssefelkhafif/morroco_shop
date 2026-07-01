import { Link, usePage } from '@inertiajs/react';

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
    const isLoggedIn = Boolean(auth?.user);

    return (
        <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white p-5 text-slate-900">
            <Link href="/" className="mb-10 text-xl font-black tracking-tight">
                Morocco Shop
            </Link>

            <nav className="space-y-1">
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

            <p className="mt-auto text-xs text-slate-400">
                Cash on Delivery · Morocco
            </p>
        </aside>
    );
}
