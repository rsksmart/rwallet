module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }], "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    'no-console': 'off',
    "max-len": ["error", { "code": 250, "ignoreComments": true }],
    "complexity": "warn",
    "camelcase": [
      "error", {
        "ignoreDestructuring": true,
        "allow": [ "^UNSAFE_" ]
      }
    ],
  },
  "parser": "@babel/eslint-parser",
};
