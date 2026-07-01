import { Head, Link } from '@inertiajs/react';

export default function Home({ auth }) {
    return (
        <>
            <Head title="Morocco Shop" />

            <main className="min-h-screen bg-slate-50 text-slate-900">
                <header className="border-b bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                        <Link href="/" className="text-xl font-black tracking-tight">
                            Morocco Shop
                        </Link>

                        <nav className="flex items-center gap-4">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                                >
                                    My Account
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-semibold">
                                        Log in
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        Create account
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <section className="mx-auto max-w-6xl px-6 py-24">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                        Cash on Delivery · Morocco
                    </p>

                    <h1 className="max-w-3xl text-5xl font-black leading-tight">
                        Order online. Confirm on WhatsApp. Pay at delivery.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                        Shop products easily without online payment. Add products to your cart,
                        complete your delivery information, then confirm the order on WhatsApp.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <button
                            type="button"
                            className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
                        >
                            Shop products
                        </button>

                        <Link
                            href="/register"
                            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold"
                        >
                            Create an optional account
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}