import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { gzipSync } from "node:zlib";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

// Plain ESM on purpose: running this through a TS transformer rewrites function
// names (`keepNames`), which breaks the script Lighthouse injects into the page.

const OUT_DIR = join(process.cwd(), "out");

export const THRESHOLDS = {
  performance: 0.9,
  accessibility: 1,
  "best-practices": 0.9,
  seo: 0.9,
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
};

const COMPRESSIBLE = new Set([".html", ".js", ".css", ".svg", ".txt", ".json"]);

/**
 * GitHub Pages compresses text responses and serves fingerprinted assets with a
 * one-year immutable cache, while HTML is revalidated on every visit. The audit
 * server mirrors both, otherwise the run penalises text compression and cache
 * efficiency that the deployed site actually provides.
 */
function send(response, candidate, request) {
  const ext = extname(candidate);
  const body = readFileSync(candidate);
  const headers = { "Content-Type": MIME[ext] ?? "application/octet-stream" };

  headers["Cache-Control"] = candidate.includes(`${join("_next", "static")}`)
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, must-revalidate";

  const acceptsGzip = /\bgzip\b/.test(request.headers["accept-encoding"] ?? "");

  if (acceptsGzip && COMPRESSIBLE.has(ext)) {
    const compressed = gzipSync(body);
    response.writeHead(200, { ...headers, "Content-Encoding": "gzip", Vary: "Accept-Encoding" });
    response.end(compressed);
    return;
  }

  response.writeHead(200, headers);
  response.end(body);
}

/**
 * Serves the exported site, mirroring how GitHub Pages resolves directories and
 * mounts a project site under its base path, so the audit exercises the same
 * URLs the deployed site uses.
 */
export function serveStatic(outDir = OUT_DIR, basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "") {
  const prefix = basePath === "" ? "" : basePath.replace(/\/$/, "");
  const notFound = [];

  return new Promise((resolve) => {
    const server = createServer((request, response) => {
      const url = new URL(request.url ?? "/", "http://localhost");
      const decoded = decodeURIComponent(url.pathname);

      // Comparison uses forward slashes; `normalize` would emit backslashes on
      // Windows and break the prefix check.
      const normalized = decoded.replace(/\\/g, "/");

      // A project site is only served under its prefix.
      if (prefix && !normalized.startsWith(`${prefix}/`) && normalized !== prefix) {
        response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        response.end(readFileSync(join(outDir, "404.html")));
        return;
      }

      // Leading slashes are stripped so the path is always resolved relative to
      // the output directory, on every platform.
      const relative = (prefix ? normalized.slice(prefix.length) : normalized).replace(
        /^\/+/,
        "");

      for (const candidate of [
        join(outDir, relative),
        join(outDir, relative, "index.html"),
        join(outDir, `${relative}.html`),
      ]) {
if (existsSync(candidate) && statSync(candidate).isFile()) {
          send(response, candidate, request);
          return;
        }
      }

      notFound.push(relative);
      if (process.env.LHR_DEBUG) {
        console.error(`  404 ${relative} (resolved ${join(outDir, relative)})`);
      }

      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(readFileSync(join(outDir, "404.html")));
    });

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        origin: `http://127.0.0.1:${typeof address === "object" ? address.port : 0}`,
        prefix,
        notFound,
        close: () => new Promise((done) => server.close(() => done())),
      });
    });
  });
}

export async function audit(origin, urlPath, port, overrides = {}) {
  const result = await lighthouse(
    `${origin}${urlPath}`,
    { port, output: "json", logLevel: "error", ...overrides },
    undefined,
  );

  const lhr = result.lhr;

  if (process.env.LHR_DEBUG) {
    const { writeFileSync } = await import("node:fs");
    const name = urlPath.replace(/[^a-z0-9]+/gi, "_") || "root";
    writeFileSync(join(process.cwd(), `${name}.lhr.json`), JSON.stringify(lhr));
  }

  return {
    performance: lhr.categories.performance.score ?? 0,
    accessibility: lhr.categories.accessibility.score ?? 0,
    "best-practices": lhr.categories["best-practices"].score ?? 0,
    seo: lhr.categories.seo.score ?? 0,
    lhr,
  };
}

/**
 * A single Lighthouse run varies noticeably with whatever else the machine is
 * doing, so each URL is measured several times and judged on the median.
 */
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

/**
 * Lists the audits that dragged a category below its threshold, so a failure
 * names the offending rule instead of only a score.
 */
export function failingAudits(lhr, categoryId) {
  const category = lhr?.categories?.[categoryId];
  if (!category) return [];

  const lines = [];

  for (const ref of category.auditRefs ?? []) {
    const audit = lhr.audits?.[ref.id];
    if (!audit || audit.score === null || audit.score >= 1) continue;

    lines.push(
      `${ref.id} (${audit.scoreDisplayMode}, score ${audit.score}): ${audit.title}`,
    );

    // Not every audit reports `details.items` as an array: some group their
    // findings under a single object, so guard before mapping.
    const items = Array.isArray(audit.details?.items) ? audit.details.items : [];
    const snippets = items
      .flatMap((item) => {
        const rect = item?.node?.boundingRect;
        const size = rect ? `${Math.round(rect.width)}x${Math.round(rect.height)}` : "no-rect";
        const own = `${item?.node?.snippet} [${size}]`;
        const other = item?.relatedNode?.snippet
          ? `${item.relatedNode.snippet} (overlapping)`
          : undefined;
        return [own, other];
      })
      .filter((snippet) => typeof snippet === "string")
      .slice(0, 6);

    for (const snippet of snippets) {
      lines.push(`          ${snippet.replace(/\s+/g, " ").slice(0, 160)}`);
    }
  }

  return lines;
}
const RUNS = Number(process.env.LH_RUNS ?? 3);

async function main() {
  const { origin, prefix, close } = await serveStatic();
  const paths = [`${prefix}/`, `${prefix}/book/`];
  const chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"] });
  const failures = [];

  try {
    for (const path of paths) {
      const samples = {
        performance: [],
        accessibility: [],
        "best-practices": [],
        seo: [],
      };
      let lastLhr = null;

      for (let run = 0; run < RUNS; run += 1) {
        const result = await audit(origin, path, chrome.port);
        lastLhr = result.lhr;
        for (const category of Object.keys(samples)) {
          samples[category].push(result[category]);
        }
      }

      console.log(`\n${path} (median of ${RUNS})`);

      // Guard against measuring an unstyled page: if the stylesheets did not
      // load, every audit still runs but reports meaningless geometry.
      const cssRequests = (lastLhr?.audits?.["network-requests"]?.details?.items ?? [])
        .filter((item) => item.resourceType === "Stylesheet")
        .map((item) => `${item.statusCode} ${item.url.split("/").pop()}`);

      if (cssRequests.length === 0) {
        console.log("  WARNING no stylesheet requests were recorded");
      } else {
        console.log(`  stylesheets: ${cssRequests.join(", ")}`);
      }

      for (const [category, threshold] of Object.entries(THRESHOLDS)) {
        const score = median(samples[category]);
        const pass = score >= threshold;
        const seen = samples[category]
          .map((value) => Math.round(value * 100))
          .join(", ");

        console.log(
          `  ${pass ? "PASS" : "FAIL"} ${category}: ${(score * 100).toFixed(0)} (min ${(threshold * 100).toFixed(0)}) [${seen}]`,
        );

        if (!pass) {
          failures.push(
            `${path} ${category} ${(score * 100).toFixed(0)} < ${(threshold * 100).toFixed(0)}`,
          );

          for (const audit of failingAudits(lastLhr, category)) {
            console.log(`        - ${audit}`);
          }
        }
      }
    }
  } finally {
    await chrome.kill();
    await close();
  }

  if (failures.length > 0) {
    console.error("\nLighthouse thresholds not met:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log("\nLighthouse thresholds met.");
}

// Only run when executed directly; importing this module (for tests) must
// not start a Chrome instance and audit the site.
const invokedDirectly = process.argv[1]?.endsWith("lighthouse-gate.mjs");

if (invokedDirectly) {
  void main();
}