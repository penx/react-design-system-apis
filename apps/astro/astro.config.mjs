// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // Emit source maps so Playwright V8 coverage maps the built _astro chunks
  // back to the @repo/ds TypeScript sources.
  vite: { build: { sourcemap: true } },
});
