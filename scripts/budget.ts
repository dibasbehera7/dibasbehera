import { readFileSync, statSync } from "node:fs";
import { gzipSync, constants as zlibConstants } from "node:zlib";
import { join, relative, sep } from "node:path";

const OUT_DIR = join(process.cwd(), "out");

/** Maximum combined JavaScript and CSS transferred for the initial page load. */
export const BUDGET_BYTES = 500 * 1024;

const ASSET_DIR = "_next/static";

/**
 * Sums the JS and CSS that the home page actually loads, following the asset
 * references in its HTML rather than counting the whole build, so unrelated
 * route chunks do not consume the budget.
 *
 * Returns both the raw on-disk size and the gzipped transfer size; the budget
 * applies to `transferBytes`.
 */
export function homePageAssetBytes(outDir = OUT_DIR) {
  const html = readFileSync(join(outDir, "index.html"), "utf8");
  const referenced = new Set<string>();

  for (const match of html.matchAll(/\/_next\/static\/[^"'\\ ]+\.(?:js|css)/g)) {
    referenced.add(match[0].replace(/^\//, ""));
  }

  const files = [...referenced].map((relativePath) => join(outDir, relativePath));
  const missing = files.filter((file) => {
    try {
      statSync(file);
      return false;
    } catch {
      return true;
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Home page references assets that were not emitted:\n${missing
        .map((file) => relative(outDir, file).split(sep).join("/"))
        .join("\n")}`,
    );
  }

  const bytes = files.reduce((total, file) => total + statSync(file).size, 0);
  // The budget is a transfer budget, so it is measured after the gzip
  // compression GitHub Pages serves.
  const transferBytes = files.reduce(
    (total, file) =>
      total + gzipSync(readFileSync(file), { level: zlibConstants.Z_BEST_COMPRESSION }).length,
    0,
  );

  return { bytes, transferBytes, fileCount: files.length };
}

/** Exposed so the reporting step can list what was counted. */
export function homePageAssetFiles(outDir = OUT_DIR) {
  const html = readFileSync(join(outDir, "index.html"), "utf8");

  return [
    ...new Set(
      [...html.matchAll(/\/_next\/static\/[^"'\\ ]+\.(?:js|css)/g)].map((match) =>
        match[0].replace(/^\//, ""),
      ),
    ),
  ].sort();
}

export { ASSET_DIR };