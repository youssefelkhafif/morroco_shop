import { Head, Link, useForm } from '@inertiajs/react';
import AdminSidebar from '@/components/admin/admin-sidebar';

export default function CreateCollection() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        subtitle: '',
        badge: '',
        image_url: '',
        sort_order: 0,
        is_active: true,
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/collections');
    }

    return (
        <>
            <Head title="Create Collection" />

            <div className="min-h-screen bg-background text-foreground">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <AdminSidebar />

                    <main className="flex-1 p-6">
                        <div className="mx-auto max-w-2xl">
                            <div className="mb-8">
                                <Link
                                    href="/admin/collections"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    ← Back to Collections
                                </Link>

                                <h1 className="mt-4 text-3xl font-bold">Create Collection</h1>
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
                                            placeholder="e.g., Summer Drop, Essentials"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-destructive">{errors.title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground">
                                            Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            value={data.subtitle}
                                            onChange={(e) => setData('subtitle', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder="e.g., Lightweight silhouettes"
                                        />
                                        {errors.subtitle && (
                                            <p className="mt-1 text-sm text-destructive">{errors.subtitle}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground">
                                            Badge
                                        </label>
                                        <input
                                            type="text"
                                            value={data.badge}
                                            onChange={(e) => setData('badge', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder="e.g., New edit, Core range, Exclusive"
                                        />
                                        {errors.badge && (
                                            <p className="mt-1 text-sm text-destructive">{errors.badge}</p>
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
                                            Create Collection
                                        </button>

                                        <Link
                                            href="/admin/collections"
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
