const config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}", // MUITO IMPORTANTE
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};
export default config;
