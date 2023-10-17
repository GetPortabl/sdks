module.exports = {
  extends: [
    'airbnb',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    'prettier',
  ],
  rules: {
    'react/require-default-props': 'off',
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function' },
    ],
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
    'no-underscore-dangle': 'off',
  },
  tsconfigRootDir: __dirname,
  plugins: ['import'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension
      extends: ['airbnb-typescript', 'prettier'],
      parserOptions: {
        sourceType: 'module',
        project: ['tsconfig.eslint.json', './packages/*/tsconfig.json'],
        allowAutomaticSingleRunInference: true,
        warnOnUnsupportedTypeScriptVersion: false,
        EXPERIMENTAL_useSourceOfProjectReferenceRedirect: false,
      },
    },
  ],
};
