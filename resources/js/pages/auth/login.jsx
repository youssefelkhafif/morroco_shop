import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(event) {
        event.preventDefault();

        post('/login', {
            onFinish: () => reset('password'),
        });
    }

    return (
        <>
            <Head title="Log in" />

            <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10 text-stone-950">
                <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                    <Link style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} href="/" className="text-lg font-black tracking-tight">
                        Streetwear Cap
                    </Link>

                    <h1 className="mt-8 text-3xl font-black">Welcome back</h1>

                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Log in to view your profile and future orders.
                    </p>

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-bold">
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(event) => setData('email', event.target.value)}
                                autoComplete="email"
                                required
                                autoFocus
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-bold">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                autoComplete="current-password"
                                required
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
                            />

                            {errors.password && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-700">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(event) => setData('remember', event.target.checked)}
                                className="size-4 rounded border-stone-300"
                            />
                            Remember me
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-stone-950 px-4 py-3 font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-stone-600">
                        New here?{' '}
                        <Link href="/register" className="font-bold text-stone-950 underline">
                            Create an account
                        </Link>
                    </p>
                </section>
            </main>
        </>
    );
}