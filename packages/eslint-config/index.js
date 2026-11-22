import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  prettier,
  {
    languageOptions: { globals: globals.node },
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "react-hooks/exhaustive-deps": "error",
    },
  },
);
