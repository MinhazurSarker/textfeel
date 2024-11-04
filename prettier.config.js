module.exports = {
    plugins: ['prettier-plugin-tailwindcss'],
    overrides: [
        {
            files: "*.css",
            options: {
                // Adjust or disable any CSS-specific formatting rules here
            }
        }
    ]
}