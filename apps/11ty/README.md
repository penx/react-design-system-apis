# 11ty example

Uses `@repo/ds` from [Eleventy](https://www.11ty.dev/) via its JSX/TSX support.

This example demonstrates the "enhancement only" architecture end to end with
**no React on the client**: 11ty renders each component to static HTML with
`ReactDOMServer.renderToStaticMarkup`, shipping the honest radio-group fallback
(tabs switch without any JavaScript). A tiny client bundle then registers the
`<ds-tabs>` custom element, which upgrades that fallback to an accessible
WAI-ARIA tablist.

```sh
pnpm --filter 11ty dev     # serve at http://localhost:8080
pnpm --filter 11ty build   # build to dist/
```

## How CSS imports are handled

DS components import their own stylesheet as a side effect — for example
`components/tabs.tsx` does `import "./tabs.css"`. Bundlers (Vite, Astro) handle
this transparently, but 11ty renders JSX through `tsx/esm` in plain Node, which
has no loader for `.css` and throws `Unknown file extension ".css"`
([11ty#235](https://github.com/11ty/eleventy/issues/235#issuecomment-2828153380)).

Two pieces solve this:

1. **A `.css` stub loader** (`lib/css-loader.js`) — a Node module hook that
   resolves any `.css` import to an empty module, so components render on the
   server without crashing. Registered after `tsx/esm` in
   `eleventy.config.js`.
2. **Passthrough copy + `<link>`** — the real CSS is delivered to the browser
   by copying the DS's stylesheet entry points into `dist/assets/ds/` and
   linking them from the layout head. This is configured once (at the DS's CSS
   entry points), not per importing component.

## The client bundle

11ty has no bundler, so `eleventy.config.js` drives [esbuild](https://esbuild.github.io/)
in the `eleventy.before` event to bundle `client/define.ts`
(`import "@repo/ds/tabs/define"`) into `dist/assets/ds/define.js`. That module
is the only JavaScript on the page.
