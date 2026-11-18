import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";

export default [
  {
    ignores: [
      ".svelte-kit/**",
      "build/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    files: ["**/*.svelte"],
    rules: { "no-undef": "off" },
    languageOptions: { parserOptions: { parser: ts.parser } },
  },
];
