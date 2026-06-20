import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import libCoverage from "istanbul-lib-coverage";
import libReport from "istanbul-lib-report";
import reports from "istanbul-reports";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const sources = [
  resolve(repoRoot, "apps/astro/coverage/e2e/coverage-final.json"),
  resolve(repoRoot, "apps/vite/coverage/e2e/coverage-final.json"),
];
const outDir = resolve(repoRoot, "coverage/merged");

const map = libCoverage.createCoverageMap({});
let found = 0;
for (const file of sources) {
  if (!existsSync(file)) {
    console.warn(`skip (missing): ${relative(repoRoot, file)}`);
    continue;
  }
  found += 1;
  map.merge(JSON.parse(readFileSync(file, "utf8")));
}

if (found === 0) {
  console.error(
    "No per-app coverage found. Run `pnpm coverage` (or each app's test:e2e:coverage) first.",
  );
  process.exit(1);
}

const context = libReport.createContext({ dir: outDir, coverageMap: map });
reports.create("text-summary").execute(context);
reports.create("html").execute(context);
reports.create("lcovonly").execute(context);
reports.create("json-summary").execute(context);
console.log(`\nMerged coverage (${found} sources) -> ${relative(repoRoot, outDir)}/`);
