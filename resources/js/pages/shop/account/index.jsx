import { Head } from '@inertiajs/react';

export default function AccountIndex({ auth }) {
    return (
        <>
            <Head title="My Account" />

            <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
                <div className="mx-auto max-w-5xl">
                    <h1 className="text-3xl font-black">
                        Welcome, {auth?.user?.name}
                    </h1>

                    <p className="mt-3 text-slate-600">
                        Your orders, saved addresses, and account settings will appear here.
                    </p>
                </div>
            </main>
        </>
    );
}