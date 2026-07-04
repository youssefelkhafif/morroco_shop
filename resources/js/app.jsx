import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Morocco Shop';

const appElement = document.getElementById('app');

if (!appElement?.dataset.page) {
    throw new Error('Inertia initial page data is missing from #app.');
}

const initialPage = JSON.parse(appElement.dataset.page);

createInertiaApp({
    page: initialPage,

    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob('./pages/**/*.jsx'),
        ),

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#111827',
    },
});

initializeTheme();