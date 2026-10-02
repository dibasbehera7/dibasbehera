import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "out");
const BOOKING_HOST = "https://cal.com/dibasbehera";

/** Internal route segments, excluding API and Next internals. */
export function internalRoutes(appDir = join(process.cwd(), "app")): string[] {
  return readdirSync(appDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("_") && !name.startsWith("."))
    .sort();
}

/**
 * The URL path segment a project site occupies is the repository name, so a
 * route segment must never equal a repository that also publishes to Pages
 * under this account.
 */
export function findCollisions(
  routes: string[],
  publishedRepoNames: string[],
): string[] {
  return routes.filter((route) => publishedRepoNames.includes(route));
}

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

/** Extracts internal (same-site) links from the built HTML. */
export function internalLinks(html: string): string[] {
  const links = new Set<string>();

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];

    if (!value.startsWith("/") || value.startsWith("//")) continue;

    links.add(value);
  }

  return [...links].sort();
}

/**
 * A root-relative reference escapes the configured prefix when it starts with a
 * slash but does not continue with the base path.
 */
export function escapingLinks(html: string, basePath: string): string[] {
  if (basePath === "") return [];

  return [...new Set(internalLinks(html))].filter(
    (link) => !link.startsWith(`${basePath}/`) && link !== basePath,
  );
}

/**
 * Verifies every internal link in the built output resolves to a real emitted
 * file, and that nothing resolves outside the configured base path.
 */
export function checkInternalLinks(outDir = OUT_DIR, basePath = "/dibasbehera") {
  const problems: string[] = [];
  const pages = existsSync(outDir) ? htmlFiles(outDir) : [];

  if (pages.length === 0) {
    return { problems: ["No built HTML found in out/"], checked: 0 };
  }

  for (const page of pages) {
    const html = readFileSync(page, "utf8");

    for (const link of internalLinks(html).filter((value) =>
      value.startsWith(basePath),
    )) {
      const path = link.split("#")[0].split("?")[0];
      const relative = path.slice(basePath.length).replace(/^\//, "");
      const candidates = [
        join(outDir, relative, "index.html"),
        join(outDir, `${relative}.html`),
        join(outDir, relative),
      ];

      if (!candidates.some((candidate) => existsSync(candidate))) {
        problems.push(`${page}: broken internal link ${link}`);
      }
    }

    if (basePath && html.includes('href="/') && !basePath.endsWith("/")) {
      for (const link of escapingLinks(html, basePath)) {
        problems.push(`${page}: link escapes base path: ${link}`);
      }
    }
  }

  return { problems, checked: pages.length };
}

/** Confirms no page outside /book loads a Cal.com script or frame. */
export function checkBookingIsolation(outDir = OUT_DIR) {
  const problems: string[] = [];

  for (const page of htmlFiles(outDir)) {
    if (page.replace(/\\/g, "/").includes("/book/")) continue;

    const html = readFileSync(page, "utf8");
    const referencesCal =
      /<script[^>]+cal\.com/.test(html) || /<iframe[^>]+cal\.com/.test(html);

    if (referencesCal) {
      problems.push(`${page}: loads Cal.com outside /book`);
    }
  }

  return problems;
}

/** Confirms the booking page still exposes the direct Cal.com link. */
export function checkBookingFallback(outDir = OUT_DIR) {
  const page = join(outDir, "book", "index.html");

  if (!existsSync(page)) {
    return [`Missing booking page at ${page}`];
  }

  return readFileSync(page, "utf8").includes(BOOKING_HOST)
    ? []
    : [`Booking page does not link to ${BOOKING_HOST}`];
}

export { BOOKING_HOST };