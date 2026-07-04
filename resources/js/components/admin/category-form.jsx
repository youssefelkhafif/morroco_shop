import { Link, useForm } from '@inertiajs/react';

const toSlug = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export default function CategoryForm({ category = null }) {
    const isEditing = Boolean(category);

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        is_active: category?.is_active ?? true,
    });

    function handleNameChange(value) {
        const currentAutoSlug = toSlug(data.name);
        const shouldUpdateSlug = !isEditing || data.slug === currentAutoSlug;

        setData('name', value);

        if (shouldUpdateSlug) {
            setData('slug', toSlug(value));
        }
    }

    function submit(event) {
        event.preventDefault();

        if (isEditing) {
            put(`/admin/categories/${category.id}`);
            return;
        }

        post('/admin/categories');
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm"
        >
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-card-foreground"
                >
                    Category name
                </label>

                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                    placeholder="Example: Electronics"
                    autoFocus
                />

                {errors.name && (
                    <p className="mt-2 text-sm text-destructive">
                        {errors.name}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="slug"
                    className="block text-sm font-medium text-card-foreground"
                >
                    URL slug
                </label>

                <input
                    id="slug"
                    type="text"
                    value={data.slug}
                    onChange={(event) => setData('slug', event.target.value)}
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                    placeholder="electronics"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                    Lowercase letters, numbers, and hyphens only.
                </p>

                {errors.slug && (
                    <p className="mt-2 text-sm text-destructive">
                        {errors.slug}
                    </p>
                )}
            </div>

            <label className="flex items-center gap-3 text-sm text-card-foreground">
                <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(event) =>
                        setData('is_active', event.target.checked)
                    }
                    className="h-4 w-4 rounded border-input"
                />

                Active category
            </label>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing
                        ? 'Saving...'
                        : isEditing
                          ? 'Save changes'
                          : 'Create category'}
                </button>

                <Link
                    href="/admin/categories"
                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}