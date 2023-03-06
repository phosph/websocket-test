/* eslint-disable no-undef */

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: 14,
    sourceType: "module",
  },
  rules: {
    indent: "off",
    "linebreak-style": "off",
    quotes: "off",
    semi: "off",
  },
};
