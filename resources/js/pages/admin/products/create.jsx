import { Head, Link } from '@inertiajs/react';
import ProductForm from '@/components/admin/product-form';

export default function CreateProduct({ categories, collections }) {
    return (
        <>
            <Head title="Create Product" />

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
                            Create product
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Add the core product information. Images come in the next stage.
                        </p>
                    </div>

                    <ProductForm categories={categories} collections={collections} />
                </div>
            </main>
        </>
    );
}