import { Head, Link } from '@inertiajs/react';
import ProductForm from '@/components/admin/product-form';
import ProductImageManager from '@/components/admin/product-image-manager';

export default function EditProduct({ product, categories }) {
    return (
        <>
            <Head title={`Edit ${product.name}`} />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8">
                        <Link
                            href="/admin/products"
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            ← Back to products
                        </Link>

                        <h1 className="mt-3 text-3xl font-bold">
                            Edit product
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Update “{product.name}”.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <ProductForm
                            product={product}
                            categories={categories}
                        />

                        <ProductImageManager
                            productId={product.id}
                            images={product.images ?? []}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}