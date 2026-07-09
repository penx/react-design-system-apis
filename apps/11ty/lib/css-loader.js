// Node module customization hook. DS components import their own stylesheet as a
// side effect (e.g. components/tabs.tsx does `import "./tabs.css"`). When 11ty
// server-renders those components through tsx/esm, Node has no loader for `.css`
// and throws `Unknown file extension ".css"`.
//
// This hook resolves any `.css` import to an empty module so the render
// succeeds. The stylesheet itself is not inlined here - it is delivered to the
// browser separately via `addPassthroughCopy` + a <link> in the layout head
// (see eleventy.config.js and src/_components/Layout.tsx).
export async function load(url, context, nextLoad) {
  if (url.endsWith(".css")) {
    return {
      format: "module",
      source: "export default {};",
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
