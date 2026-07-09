// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// When E2E_DEV_REACT is set, bundle React's development build into the static
// output (no dev server, no Astro toolbar) so hydration warnings still fire and
// the console-assertion test can catch them.
const devReact = process.env.E2E_DEV_REACT === "true";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    // Emit source maps so Playwright V8 coverage maps the built _astro chunks
    // back to the @repo/ds TypeScript sources.
    build: { sourcemap: true, minify: devReact ? false : "esbuild" },
    ...(devReact
      ? { define: { "process.env.NODE_ENV": '"development"' } }
      : {}),
  },
});
