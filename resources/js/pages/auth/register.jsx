import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(event) {
        event.preventDefault();

        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <>
            <Head title="Create account" />

            <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10 text-stone-950">
                <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                    <Link style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} href="/" className="text-lg font-black tracking-tight">
                        Streetwear Cap
                    </Link>

                    <h1 className="mt-8 text-3xl font-black">Create your account</h1>

                    <p className="mt-2 text-sm leading-6 text-stone-600">
                        Save time later and follow your orders from your profile.
                    </p>

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-bold">
                                Full name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                                autoComplete="name"
                                required
                                autoFocus
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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
                                autoComplete="new-password"
                                required
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
                            />

                            {errors.password && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-2 block text-sm font-bold"
                            >
                                Confirm password
                            </label>

                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(event) =>
                                    setData('password_confirmation', event.target.value)
                                }
                                autoComplete="new-password"
                                required
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-stone-950 px-4 py-3 font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-stone-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-stone-950 underline">
                            Log in
                        </Link>
                    </p>
                </section>
            </main>
        </>
    );
}