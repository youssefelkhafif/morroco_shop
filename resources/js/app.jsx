import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { AppContextProvider } from './context/appContext';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Morocco Shop';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    initializeTheme();

    createInertiaApp({
        title: (title) => (title ? `${title} - ${appName}` : appName),

        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.jsx`,
                import.meta.glob('./pages/**/*.jsx'),
            ),

        setup({ el, App, props }) {
            createRoot(el).render(
                <AppContextProvider>
                    <App {...props} />
                </AppContextProvider>,
            );
        },

        progress: {
            color: '#111827',
        },
    });

        // Fire Meta Pixel PageView on every successful Inertia navigation
        try {
            router.on('success', () => {
                if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                    window.fbq('track', 'PageView');
                }
            });
        } catch (e) {
            // If router isn't available, silently ignore
        }

}