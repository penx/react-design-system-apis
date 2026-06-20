module.exports = {
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  // react-hooks v7 + react-compiler ship flat-config presets; enable the rules
  // explicitly so this legacy (.eslintrc) config stays version-robust.
  plugins: ["@typescript-eslint", "react-hooks", "react-compiler"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // Rules of React from react-hooks v7: no ref read/write during render, and
    // no setState during render.
    "react-hooks/refs": "error",
    "react-hooks/set-state-in-render": "error",
    // React Compiler's holistic bail-out check.
    "react-compiler/react-compiler": "error",
  },
};
