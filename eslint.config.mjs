import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    { ignores: ['dist/', 'Archive/', 'database/'] },
    { files: ['src/**/*.{js,mjs,cjs,ts}', 'tests/**/*.{js,ts}'] },
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    {
        languageOptions: {
            parser: '@typescript-eslint/parser',
            sourceType: 'module',
            ecmaVersion: 'latest',
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig, // Disable ESLint rules that conflict with Prettier
    {
        plugins: { prettier: prettierPlugin }, // Add Prettier as an ESLint plugin
        rules: { 'prettier/prettier': 'error' }, // Run Prettier as an ESLint rule
    },
];
