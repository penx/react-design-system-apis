import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import libCoverage from "istanbul-lib-coverage";
import libReport from "istanbul-lib-report";
import reports from "istanbul-reports";
import v8toIstanbul from "v8-to-istanbul";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(here, "..");
const repoRoot = resolve(appDir, "..", "..");
const distDir = resolve(appDir, "dist");
const v8Dir = resolve(here, ".v8");
const outDir = resolve(appDir, "coverage", "e2e");

const keep = (file) => {
  const norm = file.replaceAll("\\", "/");
  return (
    norm.endsWith("packages/ds/components/tabs.tsx") ||
    norm.endsWith("packages/ds/components/ds-tabs.ts")
  );
};

async function main() {
  if (!existsSync(v8Dir)) {
    console.error("No coverage collected - run `pnpm test:e2e:coverage`.");
    process.exit(1);
  }

  const map = libCoverage.createCoverageMap({});

  for (const name of readdirSync(v8Dir).filter((n) => n.endsWith(".json"))) {
    const entries = JSON.parse(readFileSync(resolve(v8Dir, name), "utf8"));
    for (const entry of entries) {
      const { pathname } = new URL(entry.url);
      const filePath = resolve(distDir, `.${pathname}`);
      if (!existsSync(filePath)) continue;

      const converter = v8toIstanbul(filePath, 0, { source: entry.source });
      await converter.load();
      converter.applyCoverage(entry.functions);

      for (const [file, fileCov] of Object.entries(converter.toIstanbul())) {
        if (keep(file)) map.addFileCoverage(fileCov);
      }
    }
  }

  const context = libReport.createContext({ dir: outDir, coverageMap: map });
  reports.create("text-summary").execute(context);
  reports.create("html").execute(context);
  reports.create("lcovonly").execute(context);
  reports.create("json-summary").execute(context);
  reports.create("json").execute(context); // coverage-final.json, for merging

  rmSync(v8Dir, { recursive: true, force: true });
  console.log(`\nCoverage report written to ${relative(repoRoot, outDir)}/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
