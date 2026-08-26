import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

createInertiaApp({
    title: (title) => `${title} - Multikon`,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),

    setup({ el, App, props }) {
        createRoot(el).render(
            <React.StrictMode>
                <App {...props} />
            </React.StrictMode>,
        );
    },

    progress: {
        color: "#2563eb",
    },
});
