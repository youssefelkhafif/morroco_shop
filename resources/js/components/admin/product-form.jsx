import { Link, useForm } from '@inertiajs/react';

const toSlug = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export default function ProductForm({ product = null, categories = [] }) {
    const isEditing = Boolean(product);

    const { data, setData, post, put, processing, errors } = useForm({
        category_id: product?.category_id?.toString() ?? '',
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        description: product?.description ?? '',
        price_mad: product?.price_mad ?? '',
        old_price_mad: product?.old_price_mad ?? '',
        stock_quantity: product?.stock_quantity?.toString() ?? '0',
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
        colors: product?.colors?.map((color) => ({
            id: color.id,
            name: color.name,
            hex_code: color.hex_code || '#000000',
            sort_order: color.sort_order ?? 0,
        })) ?? [],
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
            put(`/admin/products/${product.id}`);
            return;
        }

        post('/admin/products');
    }

    function updateColor(index, field, value) {
        const updatedColors = [...data.colors];
        updatedColors[index] = {
            ...updatedColors[index],
            [field]: value,
        };

        setData('colors', updatedColors);
    }

    function addColor() {
        setData('colors', [
            ...data.colors,
            {
                name: '',
                hex_code: '#000000',
                sort_order: data.colors.length,
            },
        ]);
    }

    function removeColor(index) {
        setData('colors', data.colors.filter((_, i) => i !== index));
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm"
        >
            <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label
                        htmlFor="category_id"
                        className="block text-sm font-medium"
                    >
                        Category
                    </label>

                    <select
                        id="category_id"
                        value={data.category_id}
                        onChange={(event) =>
                            setData('category_id', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                    >
                        <option value="">Select a category</option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                                {!category.is_active ? ' (Inactive)' : ''}
                            </option>
                        ))}
                    </select>

                    {errors.category_id && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.category_id}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium"
                    >
                        Product name
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(event) => handleNameChange(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="Example: Wireless Headphones"
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
                        className="block text-sm font-medium"
                    >
                        URL slug
                    </label>

                    <input
                        id="slug"
                        type="text"
                        value={data.slug}
                        onChange={(event) => setData('slug', event.target.value)}
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="wireless-headphones"
                    />

                    {errors.slug && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.slug}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        rows="5"
                        value={data.description}
                        onChange={(event) =>
                            setData('description', event.target.value)
                        }
                        className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="Optional product description..."
                    />

                    {errors.description && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="price_mad"
                        className="block text-sm font-medium"
                    >
                        Current price (MAD)
                    </label>

                    <input
                        id="price_mad"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={data.price_mad}
                        onChange={(event) =>
                            setData('price_mad', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="499.99"
                    />

                    {errors.price_mad && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.price_mad}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="old_price_mad"
                        className="block text-sm font-medium"
                    >
                        Old price (MAD)
                    </label>

                    <input
                        id="old_price_mad"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={data.old_price_mad}
                        onChange={(event) =>
                            setData('old_price_mad', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="Optional — must be greater than current price"
                    />

                    {errors.old_price_mad && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.old_price_mad}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="stock_quantity"
                        className="block text-sm font-medium"
                    >
                        Stock quantity
                    </label>

                    <input
                        id="stock_quantity"
                        type="number"
                        min="0"
                        step="1"
                        value={data.stock_quantity}
                        onChange={(event) =>
                            setData('stock_quantity', event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                        placeholder="0"
                    />

                    {errors.stock_quantity && (
                        <p className="mt-2 text-sm text-destructive">
                            {errors.stock_quantity}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Colors
                            </label>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Add product color variants for the storefront.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={addColor}
                            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-black/5"
                        >
                            Add color
                        </button>
                    </div>

                    {data.colors.length === 0 ? (
                        <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                            No colors added yet.
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {data.colors.map((color, index) => {
                                const nameError = errors[`colors.${index}.name`];
                                const hexError = errors[`colors.${index}.hex_code`];

                                return (
                                    <div
                                        key={color.id ?? index}
                                        className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1.3fr_0.9fr_auto]"
                                    >
                                        <div>
                                            <label
                                                htmlFor={`colors.${index}.name`}
                                                className="block text-sm font-medium"
                                            >
                                                Color name
                                            </label>

                                            <input
                                                id={`colors.${index}.name`}
                                                type="text"
                                                value={color.name}
                                                onChange={(event) =>
                                                    updateColor(
                                                        index,
                                                        'name',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                                                placeholder="Black"
                                            />

                                            {nameError && (
                                                <p className="mt-2 text-sm text-destructive">
                                                    {nameError}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor={`colors.${index}.hex_code`}
                                                className="block text-sm font-medium"
                                            >
                                                Color code
                                            </label>

                                            <div className="mt-2 flex items-center gap-3">
                                                <input
                                                    id={`colors.${index}.hex_code`}
                                                    type="color"
                                                    value={color.hex_code}
                                                    onChange={(event) =>
                                                        updateColor(
                                                            index,
                                                            'hex_code',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="h-12 w-12 rounded-lg border border-input bg-background p-0"
                                                />

                                                <input
                                                    type="text"
                                                    value={color.hex_code}
                                                    onChange={(event) =>
                                                        updateColor(
                                                            index,
                                                            'hex_code',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                                                    placeholder="#000000"
                                                />
                                            </div>

                                            {hexError && (
                                                <p className="mt-2 text-sm text-destructive">
                                                    {hexError}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeColor(index)}
                                            className="self-end rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive/20"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {errors.colors && (
                        <p className="mt-3 text-sm text-destructive">
                            {errors.colors}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(event) =>
                            setData('is_active', event.target.checked)
                        }
                        className="h-4 w-4 rounded border-input"
                    />
                    Active product
                </label>

                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={data.is_featured}
                        onChange={(event) =>
                            setData('is_featured', event.target.checked)
                        }
                        className="h-4 w-4 rounded border-input"
                    />
                    Featured product
                </label>
            </div>

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
                          : 'Create product'}
                </button>

                <Link
                    href="/admin/products"
                    className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}