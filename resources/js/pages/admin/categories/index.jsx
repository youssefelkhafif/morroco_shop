import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoriesIndex({ categories }) {
    const { errors } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);

    function deleteCategory(category) {
        if (category.products_count > 0) {
            return;
        }

        const confirmed = window.confirm(
            `Delete "${category.name}"? This cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/admin/categories/${category.id}`, {
            preserveScroll: true,
            onStart: () => setDeletingId(category.id),
            onFinish: () => setDeletingId(null),
        });
    }

    return (
        <>
            <Head title="Categories" />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Morocco Shop / Admin
                            </p>

                            <h1 className="text-3xl font-bold text-foreground">
                                Categories
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin"
                                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/admin/categories/create"
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                            >
                                Add category
                            </Link>
                        </div>
                    </div>

                    {errors.category && (
                        <div className="mb-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {errors.category}
                        </div>
                    )}

                    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        {categories.data.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="font-medium text-card-foreground">
                                    No categories yet.
                                </p>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Create the first category before adding
                                    products.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted/40">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Category
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Slug
                                            </th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Products
                                            </th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Status
                                            </th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-border">
                                        {categories.data.map((category) => (
                                            <tr key={category.id}>
                                                <td className="px-5 py-4 text-sm font-medium text-card-foreground">
                                                    {category.name}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-muted-foreground">
                                                    {category.slug}
                                                </td>

                                                <td className="px-5 py-4 text-center text-sm text-card-foreground">
                                                    {category.products_count}
                                                </td>

                                                <td className="px-5 py-4 text-center">
                                                    <span
                                                        className={
                                                            category.is_active
                                                                ? 'inline-flex rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-400'
                                                                : 'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground'
                                                        }
                                                    >
                                                        {category.is_active
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-3">
                                                        <Link
                                                            href={`/admin/categories/${category.id}/edit`}
                                                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                category.products_count >
                                                                    0 ||
                                                                deletingId ===
                                                                    category.id
                                                            }
                                                            onClick={() =>
                                                                deleteCategory(
                                                                    category,
                                                                )
                                                            }
                                                            title={
                                                                category.products_count >
                                                                0
                                                                    ? 'Remove or move products before deleting this category.'
                                                                    : 'Delete category'
                                                            }
                                                            className="text-sm font-medium text-destructive underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            {deletingId ===
                                                            category.id
                                                                ? 'Deleting...'
                                                                : 'Delete'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {(categories.prev_page_url || categories.next_page_url) && (
                        <div className="mt-6 flex items-center justify-between">
                            {categories.prev_page_url ? (
                                <Link
                                    href={categories.prev_page_url}
                                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted"
                                >
                                    Previous
                                </Link>
                            ) : (
                                <span />
                            )}

                            <span className="text-sm text-muted-foreground">
                                Page {categories.current_page} of{' '}
                                {categories.last_page}
                            </span>

                            {categories.next_page_url ? (
                                <Link
                                    href={categories.next_page_url}
                                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted"
                                >
                                    Next
                                </Link>
                            ) : (
                                <span />
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}