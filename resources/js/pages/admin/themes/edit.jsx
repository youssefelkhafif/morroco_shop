import { Head, Link, useForm } from '@inertiajs/react';
import AdminSidebar from '@/components/admin/admin-sidebar';

const accentOptions = [
    { label: 'Black to Zinc', value: 'from-black to-zinc-700' },
    { label: 'Zinc to Stone', value: 'from-zinc-700 to-zinc-500' },
    { label: 'Stone to Stone', value: 'from-stone-700 to-stone-500' },
    { label: 'Stone to Stone Light', value: 'from-stone-600 to-stone-400' },
    { label: 'Neutral Dark', value: 'from-neutral-800 to-neutral-600' },
    { label: 'Zinc Dark', value: 'from-zinc-900 to-zinc-700' },
];

export default function EditTheme({ theme }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: theme.title,
        description: theme.description,
        accent: theme.accent,
        image_url: theme.image_url || '',
        sort_order: theme.sort_order,
        is_active: theme.is_active,
    });

    function submit(e) {
        e.preventDefault();
        patch(`/admin/themes/${theme.id}`);
    }

    return (
        <>
            <Head title={`Edit ${theme.title}`} />

            <div className="min-h-screen bg-background text-foreground">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <AdminSidebar />

                    <main className="flex-1 p-6">
                        <div className="mx-auto max-w-2xl">
                            <div className="mb-8">
                                <Link
                                    href="/admin/themes"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    ← Back to Themes
                                </Link>

                                <h1 className="mt-4 text-3xl font-bold">Edit Theme</h1>
                            </div>

                            <form
                                onSubmit={submit}
                                className="rounded-xl border border-border bg-card p-6 shadow-sm"
                            >
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-destructive">{errors.title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            rows="3"
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-destructive">{errors.description}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground">
                                            Accent Gradient
                                        </label>
                                        <select
                                            value={data.accent}
                                            onChange={(e) => setData('accent', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            {accentOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.accent && (
                                            <p className="mt-1 text-sm text-destructive">{errors.accent}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground">
                                            Image URL
                                        </label>
                                        <input
                                            type="text"
                                            value={data.image_url}
                                            onChange={(e) => setData('image_url', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder="e.g., https://dummyimage.com/400x300/000000/000000"
                                        />
                                        {errors.image_url && (
                                            <p className="mt-1 text-sm text-destructive">{errors.image_url}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground">
                                                Sort Order
                                            </label>
                                            <input
                                                type="number"
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                min="0"
                                            />
                                            {errors.sort_order && (
                                                <p className="mt-1 text-sm text-destructive">{errors.sort_order}</p>
                                            )}
                                        </div>

                                        <div className="flex items-end">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.is_active}
                                                    onChange={(e) => setData('is_active', e.target.checked)}
                                                    className="h-4 w-4 rounded border-border"
                                                />
                                                <span className="text-sm font-medium text-foreground">
                                                    Active
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                                        >
                                            Update Theme
                                        </button>

                                        <Link
                                            href="/admin/themes"
                                            className="rounded-lg border border-border bg-card px-6 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                                        >
                                            Cancel
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
