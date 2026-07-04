import { router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
]);

export default function ProductImageManager({
    productId,
    images = [],
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            images: [],
        });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [clientError, setClientError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const remainingSlots = Math.max(MAX_IMAGES - images.length, 0);

    const previews = useMemo(
        () =>
            selectedFiles.map((file) => ({
                name: file.name,
                url: URL.createObjectURL(file),
            })),
        [selectedFiles],
    );

    useEffect(() => {
        return () => {
            previews.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
            });
        };
    }, [previews]);

    const serverImageErrors = Object.entries(errors)
        .filter(
            ([key]) => key === 'images' || key.startsWith('images.'),
        )
        .map(([, message]) => message);

    function chooseImages(event) {
        const files = Array.from(event.target.files ?? []);

        setClientError('');
        clearErrors('images');

        if (files.length === 0) {
            setSelectedFiles([]);
            setData('images', []);
            return;
        }

        if (remainingSlots === 0) {
            setClientError(
                `This product already has the maximum of ${MAX_IMAGES} images.`,
            );
            event.target.value = '';
            return;
        }

        if (files.length > remainingSlots) {
            setClientError(
                `You can add only ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'}.`,
            );
            event.target.value = '';
            return;
        }

        const unsupportedFile = files.find(
            (file) => !ALLOWED_TYPES.has(file.type),
        );

        if (unsupportedFile) {
            setClientError(
                `${unsupportedFile.name} is not a supported image. Use JPG, PNG, or WEBP.`,
            );
            event.target.value = '';
            return;
        }

        const oversizedFile = files.find(
            (file) => file.size > MAX_IMAGE_SIZE_BYTES,
        );

        if (oversizedFile) {
            setClientError(
                `${oversizedFile.name} is larger than 5 MB.`,
            );
            event.target.value = '';
            return;
        }

        setSelectedFiles(files);
        setData('images', files);
    }

    function uploadImages(event) {
        event.preventDefault();

        if (data.images.length === 0) {
            setClientError('Select at least one image before uploading.');
            return;
        }

        setClientError('');

        post(`/admin/products/${productId}/images`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset('images');
                setSelectedFiles([]);
            },
        });
    }

    function deleteImage(image) {
        const confirmed = window.confirm(
            'Delete this product image? This cannot be undone.',
        );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/admin/products/${productId}/images/${image.id}`,
            {
                preserveScroll: true,
                onStart: () => setDeletingId(image.id),
                onFinish: () => setDeletingId(null),
            },
        );
    }

    return (
        <section className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Product images
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        JPG, PNG, or WEBP. Maximum 5 MB per image. Maximum{' '}
                        {MAX_IMAGES} images per product.
                    </p>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                    {images.length} / {MAX_IMAGES}
                </span>
            </div>

            {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((image, index) => (
                        <article
                            key={image.id}
                            className="overflow-hidden rounded-lg border border-border bg-background"
                        >
                            <img
                                src={image.url}
                                alt={`Product image ${index + 1}`}
                                className="aspect-square w-full object-cover"
                            />

                            <div className="flex items-center justify-between gap-2 p-3">
                                <span className="text-xs text-muted-foreground">
                                    Image {index + 1}
                                </span>

                                <button
                                    type="button"
                                    disabled={deletingId === image.id}
                                    onClick={() => deleteImage(image)}
                                    className="text-xs font-semibold text-destructive hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {deletingId === image.id
                                        ? 'Deleting...'
                                        : 'Delete'}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {images.length === 0 && (
                <div className="mt-6 rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
                    No images uploaded yet.
                </div>
            )}

            {remainingSlots > 0 && (
                <form
                    onSubmit={uploadImages}
                    className="mt-6 border-t border-border pt-6"
                >
                    <label
                        htmlFor="images"
                        className="block text-sm font-medium"
                    >
                        Add images
                    </label>

                    <input
                        id="images"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        multiple
                        disabled={processing}
                        onChange={chooseImages}
                        className="mt-2 block w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/70"
                    />

                    {clientError && (
                        <p className="mt-3 text-sm text-destructive">
                            {clientError}
                        </p>
                    )}

                    {serverImageErrors.map((error, index) => (
                        <p
                            key={`${error}-${index}`}
                            className="mt-3 text-sm text-destructive"
                        >
                            {error}
                        </p>
                    ))}

                    {previews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {previews.map((preview) => (
                                <article
                                    key={preview.url}
                                    className="overflow-hidden rounded-lg border border-dashed border-border bg-background"
                                >
                                    <img
                                        src={preview.url}
                                        alt={preview.name}
                                        className="aspect-square w-full object-cover"
                                    />

                                    <p className="truncate p-2 text-xs text-muted-foreground">
                                        {preview.name}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing || data.images.length === 0}
                        className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing
                            ? 'Uploading...'
                            : `Upload ${data.images.length || ''} image${data.images.length === 1 ? '' : 's'}`}
                    </button>
                </form>
            )}
        </section>
    );
}