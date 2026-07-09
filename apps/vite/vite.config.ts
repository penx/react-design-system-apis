import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Deploys under a sub-path on GitHub Pages (e.g. /react-design-system-apis/vite/).
  // BASE_PATH is set only by the Pages workflow; unset locally so dev/e2e stay at "/".
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  build: {
    sourcemap: true,
    // Unminified under coverage so V8->Istanbul recovers branch/function data.
    minify: process.env.E2E_COVERAGE === "true" ? false : "esbuild",
  },
});
