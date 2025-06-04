import js from "@eslint/js";
import * as tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // Prevent console.log in production code (allow warn and error)
      "no-console": [
        "error",
        { allow: ["warn", "error", "info", "debug", "trace"] },
      ],
      // TypeScript best practices
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      // Node.js specific rules
      // "no-process-exit": "error",
    },
  },
];
