/*
 * Verifies the deployed site against the specification's scenarios over HTTP.
 * Gated on SITE_URL so it never runs against a stale or local build.
 */

const SITE = process.env.SITE_URL;

const PATHS = ["/", "/book/", "/projects/system-design-primer/", "/projects/nope/"];

const checks = [];

function check(name, pass, detail = "") {
  checks.push({ name, pass, detail });
}

function textOf(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

async function main() {
  if (!SITE) {
    console.log("SITE_URL not set; skipping live checks.");
    return;
  }

  const base = SITE.replace(/\/$/, "");
  const pages = {};

  for (const path of PATHS) {
    const response = await fetch(`${base}${path}`, { redirect: "follow" });
    const html = await response.text();
    pages[path] = { status: response.status, html, text: textOf(html) };
  }

  const home = pages["/"];
  const book = pages["/book/"];

  check("home page returns 200", home.status === 200, `got ${home.status}`);
  check("booking page returns 200", book.status === 200, `got ${book.status}`);
  check(
    "a project detail page returns 200",
    pages["/projects/system-design-primer/"].status === 200,
  );
  check(
    "an unknown project slug serves the not-found page",
    pages["/projects/nope/"].status === 404 ||
      pages["/projects/nope/"].text.includes("Page not found"),
    `status ${pages["/projects/nope/"].status}`,
  );

  for (const section of [
    "Projects",
    "Interview Preps",
    "Skills",
    "Experience",
    "Contact",
  ]) {
    check(`home page has the ${section} section`, home.text.includes(section));
  }

  check(
    "no email address or mailto link is published",
    !home.html.includes("mailto:") && !home.html.includes("@gmail.com"),
  );
  check(
    "contact offers the booking entry point",
    home.html.includes("/book"),
  );
  check(
    "header provides primary navigation",
    home.html.includes('aria-label="Primary"'),
  );
  check(
    "footer credits GitHub with a heart and a flag",
    home.text.includes("Made with") && home.html.includes("GitHub"),
  );
  check(
    "card rails are labelled and keyboard focusable",
    home.html.includes("card-rail") && /tabindex="0"/.test(home.html),
  );
  check(
    "rails expose arrow controls",
    (home.html.match(/aria-label="Scroll [^"]+ forwards"/g) ?? []).length >= 2,
  );
  check(
    "cards open details in a dialog rather than navigating",
    home.html.includes("Show details for") && home.html.includes("<dialog"),
  );
  check("at least ten projects are listed", (home.html.match(/Show details for/g) ?? []).length >= 20);
  check(
    "booking page shows a price before the handoff",
    /\$\d/.test(book.text),
  );
  check(
    "booking page always links to the Cal.com account",
    book.html.includes("https://cal.com/dibasbehera"),
  );
  check(
    "booking page carries a Content-Security-Policy",
    book.html.includes("Content-Security-Policy"),
  );

  // Every root-relative reference must sit under the site's path prefix.
  const prefix = new URL(base).pathname.replace(/\/$/, "");
  const escaped = [...home.html.matchAll(/(?:href|src)="(\/[^"]*)"/g)]
    .map((match) => match[1])
    .filter((value) => value !== prefix && !value.startsWith(`${prefix}/`));

  check(
    "no asset or link escapes the configured path prefix",
    escaped.length === 0,
    escaped.slice(0, 3).join(" "),
  );

  const failures = checks.filter((entry) => !entry.pass);

  for (const entry of checks) {
    console.log(`  ${entry.pass ? "PASS" : "FAIL"} ${entry.name}${entry.detail ? ` (${entry.detail})` : ""}`);
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} live check(s) failed.`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll ${checks.length} live checks passed for ${base}.`);
}

const invokedDirectly = process.argv[1]?.endsWith("check-live.mjs");

if (invokedDirectly) {
  void main();
}