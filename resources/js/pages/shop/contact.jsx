import { Head, Link } from '@inertiajs/react';
import { Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import ShopNavigation from '@/components/shop-navigation';

export default function Contact({ auth, contact_email, contact_phone }) {
    const whatsappNumber = contact_phone?.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hello, I would like to get in touch regarding Street Wear Cap.`;
    const emailLink = `mailto:${contact_email}`;

    return (
        <>
            <Head title="Contact Us | Street Wear Cap" />

            <main className="min-h-screen bg-background text-foreground">
                <ShopNavigation auth={auth} cartItemCount={0} />

                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        <div>
                            <h1 style={{ fontFamily: '"Bodoni Moda", serif', fontWeight: 700 }} className="text-5xl font-bold tracking-tight mb-6">
                                Get In Touch
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Have questions about our products or need support? We'd love to hear from you. Choose your preferred way to contact us below.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Email Card */}
                        <div className="rounded-lg border border-border bg-card p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Email Us</h3>
                                    <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                                </div>
                            </div>
                            
                            <p className="text-2xl font-bold mb-6">{contact_email}</p>
                            
                            <a
                                href={emailLink}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 w-full"
                            >
                                <Mail className="h-5 w-5" />
                                Send Email
                            </a>
                        </div>

                        {/* WhatsApp Card */}
                        <div className="rounded-lg border border-border bg-card p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                    <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">WhatsApp</h3>
                                    <p className="text-sm text-muted-foreground">Chat with us directly</p>
                                </div>
                            </div>
                            
                            <p className="text-2xl font-bold mb-6">{contact_phone}</p>
                            
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 w-full"
                            >
                                <MessageCircle className="h-5 w-5" />
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* Additional Info */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="rounded-lg border border-border bg-card p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="h-6 w-6 text-stone-600 dark:text-stone-300" />
                                <h3 className="text-lg font-bold">Location</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Street Wear Cap<br />
                                Casablanca, Morocco<br />
                                Available for local and international shipping
                            </p>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-6 w-6 text-stone-600 dark:text-stone-300" />
                                <h3 className="text-lg font-bold">Response Time</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                <strong>Email:</strong> Within 24 hours<br />
                                <strong>WhatsApp:</strong> Within 2 hours (during business hours)<br />
                                <strong>Timezone:</strong> GMT/UTC +1
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
                    <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                    
                    <div className="space-y-6">
                        <div className="rounded-lg border border-border bg-card p-6">
                            <h4 className="font-bold mb-2">How long does shipping take?</h4>
                            <p className="text-muted-foreground">Shipping usually takes 2-5 business days within Morocco. International shipping may take 7-14 days.</p>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-6">
                            <h4 className="font-bold mb-2">What's your return policy?</h4>
                            <p className="text-muted-foreground">We accept returns within 14 days of purchase for unused items in original packaging. Contact us for details.</p>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-6">
                            <h4 className="font-bold mb-2">Do you offer bulk discounts?</h4>
                            <p className="text-muted-foreground">Yes! For bulk orders, please contact us directly via email or WhatsApp for special pricing.</p>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-6">
                            <h4 className="font-bold mb-2">What payment methods do you accept?</h4>
                            <p className="text-muted-foreground">We currently accept cash on delivery (COD) for all orders in Morocco.</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-stone-200 bg-stone-50 p-8 text-center dark:border-stone-800 dark:bg-stone-900">
                        <h2 className="text-3xl font-bold mb-4">Ready to shop?</h2>
                        <p className="text-muted-foreground mb-6">Explore our collection of premium streetwear caps.</p>
                        <Link
                            href="/"
                            className="inline-block rounded-lg bg-stone-950 px-8 py-3 font-bold text-white transition hover:bg-stone-800"
                        >
                            Back to Shop
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
