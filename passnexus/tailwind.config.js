/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-blue': '#00f0ff',
                'cyber-dark': '#0a0e27',
            },
        },
    },
    plugins: [],
}
