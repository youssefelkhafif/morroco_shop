import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <>
            <Head title="Admin Dashboard" />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Morocco Shop
                            </p>

                            <h1 className="text-3xl font-bold">
                                Admin Dashboard
                            </h1>
                        </div>

                        <Link
                            href="/"
                            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                        >
                            View Store
                        </Link>
                    </div>

                    <section className="grid gap-4 md:grid-cols-2">
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
                    </section>
                </div>
            </main>
        </>
    );
}