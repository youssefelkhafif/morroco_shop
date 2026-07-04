import { Head, Link } from '@inertiajs/react';
import CategoryForm from '@/components/admin/category-form';

export default function CreateCategory() {
    return (
        <>
            <Head title="Create Category" />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <Link
                            href="/admin/categories"
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            ← Back to categories
                        </Link>

                        <h1 className="mt-3 text-3xl font-bold text-foreground">
                            Create category
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Categories organize products in the storefront.
                        </p>
                    </div>

                    <CategoryForm />
                </div>
            </main>
        </>
    );
}