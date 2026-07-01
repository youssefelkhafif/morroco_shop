import { Link } from '@inertiajs/react';

export default function Navbar({ auth }) {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-lg font-black text-slate-900">
                    Morocco Shop
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/shop" className="text-sm font-semibold text-slate-700">
                        Shop
                    </Link>

                    <Link href="/cart" className="text-sm font-semibold text-slate-700">
                        Cart
                    </Link>

                    {auth?.user ? (
                        <Link
                            href="/dashboard"
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                        >
                            My Account
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
