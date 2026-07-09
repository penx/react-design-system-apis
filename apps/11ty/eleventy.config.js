import "tsx/esm";
import { register } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import * as esbuild from "esbuild";

// Register the `.css` stub loader (see lib/css-loader.js) AFTER tsx/esm so it
// sits outermost in the hook chain and delegates everything non-CSS to tsx.
register("./lib/css-loader.js", import.meta.url);

export default function (eleventyConfig) {
  // Treat *.11ty.{jsx,ts,tsx} as templates. Each renders to static HTML via
  // ReactDOMServer - there is no React on the client (11ty#235).
  eleventyConfig.addTemplateFormats("11ty.jsx,11ty.ts,11ty.tsx");
  eleventyConfig.addExtension(["11ty.jsx", "11ty.ts", "11ty.tsx"], {
    key: "11ty.js",
    compile() {
      return async function (data) {
        const content = await this.defaultRenderer(data);
        return "<!doctype html>" + renderToStaticMarkup(content);
      };
    },
  });

  // Deliver the DS stylesheets that the `.css` stub omits from SSR. Defined once
  // at the DS's CSS entry points rather than per importing component.
  eleventyConfig.addPassthroughCopy({
    "node_modules/@repo/ds/style.css": "assets/ds/style.css",
    "node_modules/@repo/ds/components/tabs.css": "assets/ds/tabs.css",
  });

  // Bundle the <ds-tabs> custom element for the browser. 11ty has no bundler of
  // its own, so we drive esbuild before each build (also runs under --serve).
  eleventyConfig.on("eleventy.before", async () => {
    await esbuild.build({
      entryPoints: ["client/define.ts"],
      bundle: true,
      format: "esm",
      target: "es2020",
      outfile: "dist/assets/ds/define.js",
      logLevel: "warning",
    });
  });

  return { dir: { input: "src", output: "dist" } };
}
