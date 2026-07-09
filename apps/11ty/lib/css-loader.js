// Resolve `.css` imports to an empty module so DS components that import their
// own stylesheet can be server-rendered under tsx/esm. The real CSS is
// delivered via addPassthroughCopy + <link> (see eleventy.config.js).
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
