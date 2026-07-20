import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Trash2 } from 'lucide-react';

export default function CollectionsIndex({ collections }) {
    const { errors } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);

    function deleteCollection(collection) {
        const confirmed = window.confirm(
            `Delete "${collection.title}"? This cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/admin/collections/${collection.id}`, {
            preserveScroll: true,
            onStart: () => setDeletingId(collection.id),
            onFinish: () => setDeletingId(null),
        });
    }

    return (
        <>
            <Head title="Collections" />

            <div className="min-h-screen bg-background text-foreground">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <main className="flex-1 p-6">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Morocco Shop / Admin
                                    </p>

                                    <h1 className="text-3xl font-bold text-foreground">
                                        Collections
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
                                        href="/admin/collections/create"
                                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                                    >
                                        Add collection
                                    </Link>
                                </div>
                            </div>

                            {errors.collection && (
                                <div className="mb-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    {errors.collection}
                                </div>
                            )}

                            <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                                {collections.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="font-medium text-card-foreground">
                                            No collections yet.
                                        </p>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Create the first collection to showcase editorial content on your home page.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-border">
                                            <thead className="bg-muted/40">
                                                <tr>
                                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                        Title
                                                    </th>
                                                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                        Image
                                                    </th>
                                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                        Subtitle
                                                    </th>
                                                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                        Badge
                                                    </th>
                                                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                        Sort Order
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
                                                {collections.map((collection) => (
                                                    <tr key={collection.id} className="hover:bg-muted/20 transition">
                                                        <td className="px-5 py-4 text-sm font-medium">
                                                            {collection.title}
                                                        </td>

                                                        <td className="px-5 py-4 text-center text-sm">
                                                            {collection.image_url ? (
                                                                <img src={collection.image_url} alt={collection.title} className="h-10 w-10 rounded object-cover" />
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">No image</span>
                                                            )}
                                                        </td>

                                                        <td className="max-w-xs px-5 py-4 text-sm text-muted-foreground">
                                                            {collection.subtitle}
                                                        </td>

                                                        <td className="px-5 py-4 text-center text-sm">
                                                            <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                                                                {collection.badge}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4 text-center text-sm">
                                                            {collection.sort_order}
                                                        </td>

                                                        <td className="px-5 py-4 text-center text-sm">
                                                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${collection.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                                {collection.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4 text-right text-sm">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={`/admin/collections/${collection.id}/edit`}
                                                                    className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                                >
                                                                    Edit
                                                                </Link>

                                                                <button
                                                                    type="button"
                                                                    disabled={deletingId === collection.id}
                                                                    onClick={() => deleteCollection(collection)}
                                                                    className="rounded px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                                >
                                                                    {deletingId === collection.id ? 'Deleting...' : (
                                                                        <>
                                                                            <Trash2 className="inline h-3.5 w-3.5 mr-1" />
                                                                            Delete
                                                                        </>
                                                                    )}
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
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

CollectionsIndex.layout = (page) => <AdminLayout>{page}</AdminLayout>;