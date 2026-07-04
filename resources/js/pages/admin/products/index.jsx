import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const formatMad = (amount) => `${Number(amount).toFixed(2)} MAD`;

export default function ProductsIndex({ products }) {
    const [deletingId, setDeletingId] = useState(null);

    function deleteProduct(product) {
        const confirmed = window.confirm(
            `Delete "${product.name}"? This cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/admin/products/${product.id}`, {
            preserveScroll: true,
            onStart: () => setDeletingId(product.id),
            onFinish: () => setDeletingId(null),
        });
    }

    return (
        <>
            <Head title="Products" />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Morocco Shop / Admin
                            </p>

                            <h1 className="text-3xl font-bold">Products</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin"
                                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/admin/products/create"
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                            >
                                Add product
                            </Link>
                        </div>
                    </div>

                    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        {products.data.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="font-medium">No products yet.</p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Create a product after creating at least one category.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted/40">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Product
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Category
                                            </th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Price
                                            </th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Stock
                                            </th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Images
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
                                        {products.data.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-card-foreground">
                                                        {product.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {product.slug}
                                                    </p>

                                                    {product.is_featured && (
                                                        <span className="mt-2 inline-flex rounded-full bg-primary/15 px-2 py-1 text-xs font-semibold text-primary">
                                                            Featured
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-card-foreground">
                                                    {product.category.name}
                                                </td>

                                                <td className="px-5 py-4 text-right text-sm">
                                                    <p className="font-semibold text-card-foreground">
                                                        {formatMad(product.price_mad)}
                                                    </p>

                                                    {product.old_price_mad && (
                                                        <p className="mt-1 text-xs text-muted-foreground line-through">
                                                            {formatMad(product.old_price_mad)}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-center text-sm">
                                                    <span
                                                        className={
                                                            product.stock_quantity > 0
                                                                ? 'font-medium text-card-foreground'
                                                                : 'font-medium text-destructive'
                                                        }
                                                    >
                                                        {product.stock_quantity}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-center text-sm text-muted-foreground">
                                                    {product.images_count}
                                                </td>

                                                <td className="px-5 py-4 text-center">
                                                    <span
                                                        className={
                                                            product.is_active
                                                                ? 'inline-flex rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-400'
                                                                : 'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground'
                                                        }
                                                    >
                                                        {product.is_active
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-3">
                                                        <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            disabled={deletingId === product.id}
                                                            onClick={() =>
                                                                deleteProduct(product)
                                                            }
                                                            className="text-sm font-medium text-destructive underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {deletingId === product.id
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

                    {(products.prev_page_url || products.next_page_url) && (
                        <div className="mt-6 flex items-center justify-between">
                            {products.prev_page_url ? (
                                <Link
                                    href={products.prev_page_url}
                                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted"
                                >
                                    Previous
                                </Link>
                            ) : (
                                <span />
                            )}

                            <span className="text-sm text-muted-foreground">
                                Page {products.current_page} of {products.last_page}
                            </span>

                            {products.next_page_url ? (
                                <Link
                                    href={products.next_page_url}
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