import "tsx/esm";
import { register } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import * as esbuild from "esbuild";

// Registered after tsx/esm so it sits outermost and delegates non-CSS to tsx.
register("./lib/css-loader.js", import.meta.url);

export default function (eleventyConfig) {
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

  eleventyConfig.addPassthroughCopy({
    "node_modules/@repo/ds/style.css": "assets/ds/style.css",
    "node_modules/@repo/ds/components/tabs.css": "assets/ds/tabs.css",
  });

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
