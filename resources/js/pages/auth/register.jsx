import { Head, Link, useForm } from '@inertiajs/react';
import { MoonStar, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const { resolvedAppearance, updateAppearance } = useAppearance();

    function submit(event) {
        event.preventDefault();

        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <>
            <Head title="Create account" />

            <main className="min-h-screen bg-background text-foreground px-4 py-10">
                <section className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-card/90 p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-4">
                        <Link style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} href="/" className="text-lg font-black tracking-tight text-foreground">
                            Streetwear Cap
                        </Link>
                        <button
                            type="button"
                            aria-label="Toggle theme"
                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-foreground/10"
                        >
                            {resolvedAppearance === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                        </button>
                    </div>

                    <h1 className="mt-8 text-4xl font-black tracking-tight text-foreground">Create your account</h1>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Save time and follow your orders from your profile.
                    </p>

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-foreground">
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
                                className="w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm font-medium text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(event) => setData('email', event.target.value)}
                                autoComplete="email"
                                required
                                className="w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm font-medium text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-foreground">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                autoComplete="new-password"
                                required
                                className="w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                            />

                            <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                Use at least 8 characters, one uppercase letter, and one symbol.
                            </p>

                            {errors.password && (
                                <p className="mt-2 text-sm font-medium text-destructive">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-2 block text-sm font-semibold text-foreground"
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
                                className="w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-sm transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-foreground underline-offset-2 hover:text-white">
                            Log in
                        </Link>
                    </p>
                </section>
            </main>
        </>
    );
}