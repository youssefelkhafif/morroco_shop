import { Head, Link } from '@inertiajs/react';
import DeliveryZoneForm from '@/components/admin/delivery-zone-form';

export default function CreateDeliveryZone() {
    return (
        <>
            <Head title="Add delivery zone" />

            <main className="min-h-screen bg-background p-6 text-foreground">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <Link
                            href="/admin/delivery-zones"
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            ← Back to delivery zones
                        </Link>

                        <h1 className="mt-3 text-3xl font-bold">
                            Add delivery zone
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Set the delivery fee and estimated time for a city.
                        </p>
                    </div>

                    <DeliveryZoneForm />
                </div>
            </main>
        </>
    );
}