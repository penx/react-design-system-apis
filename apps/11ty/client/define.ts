// Browser entry: register the <ds-tabs> custom element. esbuild bundles this to
// dist/assets/ds/define.js (see eleventy.config.js), and the layout loads it so
// the server-rendered radio fallback upgrades to an accessible tablist. This is
// the only JavaScript that runs on the client - there is no React runtime.
import "@repo/ds/tabs/define";
