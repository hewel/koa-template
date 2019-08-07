module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    plugins: ['prettier'],
    rules: {
        semi: 'off',
        'linebreak-style': 'off',
        'import/no-unresolved': [2, { ignore: [`U|utils.*`] }],
        'import/extensions': [2, 'never', { jsx: 'always', json: 'always' }],
        'no-unused-vars': ['warn', { args: 'after-used' }],
    },
    overrides: [
        {
            files: ['*.jsx', '*.tsx'],
            rules: {
                // 'react/jsx-indent': 'off',
                // 'prettier/prettier': 'off',
                'react-hooks/rules-of-hooks': 'error',
                'react-hooks/exhaustive-deps': 'warn',
                'react/prop-types': [
                    1,
                    {
                        ignore: ['className', 'children'],
                    },
                ],
            },
        },
    ],
}
