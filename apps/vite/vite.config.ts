import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    // Unminified under coverage so V8->Istanbul recovers branch/function data.
    minify: process.env.E2E_COVERAGE === "true" ? false : "esbuild",
  },
});
