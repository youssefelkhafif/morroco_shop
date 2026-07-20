import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';

const notifications = [
    {
        id: 1,
        title: 'Pending confirmations',
        description: '2 orders are waiting for admin approval.',
    },
    {
        id: 2,
        title: 'Delivery update',
        description: 'A delivery zone was updated and is ready for checkout.',
    },
    {
        id: 3,
        title: 'Stock alert',
        description: 'One product is running low and may need replenishment.',
    },
];

export default function AdminDashboard() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-background text-foreground">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <main className="flex-1 p-6">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Streetwear Cap
                                    </p>

                                    <h1 className="text-3xl font-bold">
                                        Admin Dashboard
                                    </h1>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsNotificationsOpen(true)}
                                        className="relative rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                                    >
                                        <span className="text-base">🔔</span>
                                        <span className="ml-2">Alerts</span>
                                        <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                                            3
                                        </span>
                                    </button>

                                    <Link
                                        href="/"
                                        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                                    >
                                        View Store
                                    </Link>
                                </div>
                            </div>

                            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <article className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                            <h2 className="text-lg font-semibold">
                                Categories
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Organize the shop catalog before assigning products.
                            </p>

                            <Link
                                href="/admin/categories"
                                className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                            >
                                Manage categories
                            </Link>
                        </article>

                        <article className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                            <h2 className="text-lg font-semibold">
                                Products
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Manage prices, stock, category, active status, and featured items.
                            </p>

                            <Link
                                href="/admin/products"
                                className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                            >
                                Manage products
                            </Link>
                        </article>

                        <article className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                            <h2 className="text-lg font-semibold">
                                Orders
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Review incoming orders, confirm pending orders, and cancel them when needed.
                            </p>

                            <Link
                                href="/admin/orders"
                                className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                            >
                                Manage orders
                            </Link>
                        </article>

                            </section>
                        </div>
                    </main>
                </div>
            </div>

            {isNotificationsOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 p-4 sm:p-6"
                    onClick={() => setIsNotificationsOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">
                                    Inbox
                                </p>
                                <h2 className="mt-1 text-xl font-semibold">
                                    Quick alerts
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsNotificationsOpen(false)}
                                className="rounded-full p-2 text-sm text-muted-foreground transition hover:bg-muted"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {notifications.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-border bg-background p-3"
                                >
                                    <p className="text-sm font-semibold text-foreground">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

AdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;