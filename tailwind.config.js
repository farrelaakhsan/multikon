import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.js",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    900: "#1E293B",
                    amber: "#F59E0B",
                    "amber-soft": "#FEF3C7",
                },
                surface: {
                    DEFAULT: "#FFFFFF",
                    alt: "#F1F5F9",
                    muted: "#F1F5F9",
                },
                status: {
                    pending: { bg: "#FEF3C7", fg: "#92400E" },
                    review: { bg: "#EDE9FE", fg: "#6D28D9" },
                    process: { bg: "#DBEAFE", fg: "#1D4ED8" },
                    shipped: { bg: "#E0E7FF", fg: "#4338CA" },
                    success: { bg: "#D1FAE5", fg: "#047857" },
                    danger: { bg: "#FEE2E2", fg: "#B91C1C" },
                },
            },
            boxShadow: {
                card: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
                "card-hover":
                    "0 4px 16px -2px rgb(0 0 0 / 0.12), 0 2px 6px -2px rgb(0 0 0 / 0.06)",
                sticky: "0 -4px 16px -4px rgb(0 0 0 / 0.10)",
            },
            borderRadius: {
                card: "1rem",
                pill: "9999px",
            },
            maxWidth: {
                content: "min(90vw, 56rem)",
            },
        },
    },

    plugins: [forms],
};
