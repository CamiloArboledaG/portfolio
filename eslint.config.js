const js = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            '@typescript-eslint': typescript,
        },
        rules: {
            // Tus reglas aquí
        },
    },
];