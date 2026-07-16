import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { Trash2 } from 'lucide-react';

export default function ThemesIndex({ themes }) {
    const { errors } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);

    function deleteTheme(theme) {
        const confirmed = window.confirm(
            `Delete "${theme.title}"? This cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/admin/themes/${theme.id}`, {
            preserveScroll: true,
            onStart: () => setDeletingId(theme.id),
            onFinish: () => setDeletingId(null),
        });
    }

    return (
        <>
            <Head title="Themes" />

            <div className="min-h-screen bg-background text-foreground">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <AdminSidebar />

                    <main className="flex-1 p-6">
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Morocco Shop / Admin
                                    </p>

                                    <h1 className="text-3xl font-bold text-foreground">
                                        Themes
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
                                        href="/admin/themes/create"
                                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                                    >
                                        Add theme
                                    </Link>
                                </div>
                            </div>

                            {errors.theme && (
                                <div className="mb-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    {errors.theme}
                                </div>
                            )}

                            <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                                {themes.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="font-medium text-card-foreground">
                                            No themes yet.
                                        </p>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Create the first theme to customize your home page collections.
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
                                                        Description
                                                    </th>
                                                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                        Accent
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
                                                {themes.map((theme) => (
                                                    <tr key={theme.id} className="hover:bg-muted/20 transition">
                                                        <td className="px-5 py-4 text-sm font-medium">
                                                            {theme.title}
                                                        </td>

                                                        <td className="px-5 py-4 text-center text-sm">
                                                            {theme.image_url ? (
                                                                <img src={theme.image_url} alt={theme.title} className="h-10 w-10 rounded object-cover" />
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">No image</span>
                                                            )}
                                                        </td>

                                                        <td className="max-w-xs px-5 py-4 text-sm text-muted-foreground">
                                                            {theme.description.substring(0, 50)}
                                                            {theme.description.length > 50 ? '...' : ''}
                                                        </td>

                                                        <td className="px-5 py-4 text-center text-sm">
                                                            <span
                                                                className={`inline-block h-6 w-6 rounded border border-border ${theme.accent.replace(
                                                                    'from-',
                                                                    'bg-',
                                                                ).split(' ')[0]}`}
                                                            />
                                                        </td>

                                                        <td className="px-5 py-4 text-center text-sm">
                                                            {theme.sort_order}
                                                        </td>

                                                        <td className="px-5 py-4 text-center text-sm">
                                                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${theme.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                                {theme.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4 text-right text-sm">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={`/admin/themes/${theme.id}/edit`}
                                                                    className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                                >
                                                                    Edit
                                                                </Link>

                                                                <button
                                                                    type="button"
                                                                    disabled={deletingId === theme.id}
                                                                    onClick={() => deleteTheme(theme)}
                                                                    className="rounded px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                                >
                                                                    {deletingId === theme.id ? 'Deleting...' : (
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
