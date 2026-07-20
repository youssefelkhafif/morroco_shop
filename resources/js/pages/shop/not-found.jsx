import { Head, Link, router } from '@inertiajs/react';
import ShopNavigation from '@/components/shop-navigation';

export default function ShopNotFound({ auth, cart_item_count: cartItemCount = 0 }) {
    return (
        <>
            <Head title="Page Not Found | Street Wear Cap" />

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation auth={auth} cartItemCount={cartItemCount} />

                <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
                    <div className="w-full rounded-[2rem] border border-border bg-card p-10 text-center shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">404 error</p>
                        <h1 className="mt-4 text-5xl font-black tracking-tight text-foreground sm:text-6xl">Page not found</h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
                            The page you are looking for does not exist or has been moved. Use the buttons below to go back or return to the homepage.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                            >
                                Go back
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                            >
                                Go home
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
