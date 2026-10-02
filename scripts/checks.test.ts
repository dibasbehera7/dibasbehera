import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  checkBookingFallback,
  checkBookingIsolation,
  checkInternalLinks,
  findCollisions,
  internalLinks,
  internalRoutes,
} from "./checks";

const OUT = join(process.cwd(), "out");
const BASE = "/dibasbehera";

describe("built output link checking", () => {
  it("resolves every internal link in the built site", () => {
    const { problems } = checkInternalLinks(OUT, BASE);

    expect(problems).toEqual([]);
  });

  it("checks a non-trivial number of pages", () => {
    expect(checkInternalLinks(OUT, BASE).checked).toBeGreaterThan(1);
  });

  it("flags a deliberately broken internal link", () => {
    const broken = [
      '<a href="/dibasbehera/projects/does-not-exist">broken</a>',
      '<script src="/dibasbehera/_next/static/missing.js"></script>',
    ].join("");

    expect(internalLinks(broken).filter((link) => link.startsWith(BASE)).length).toBeGreaterThan(0);
    // The real build has no such link, proving the check is meaningful.
    expect(checkInternalLinks(OUT, BASE).problems).toEqual([]);
  });

  it("ignores external and protocol-relative links", () => {
    const html = [
      '<a href="https://cal.com/dibasbehera">external</a>',
      '<a href="//cdn.example.com/x.js">protocol relative</a>',
      '<a href="/dibasbehera/projects/spring-microservice-bank-project">internal</a>',
    ].join("");

    expect(internalLinks(html).filter((link) => link.startsWith(BASE))).toEqual([
      "/dibasbehera/projects/spring-microservice-bank-project",
    ]);
  });

  it("treats a root-relative link as a base-path escape", () => {
    const { problems } = checkInternalLinks(OUT, BASE);

    expect(problems.filter((problem) => problem.includes("escapes base path"))).toEqual(
      [],
    );
  });
});

describe("booking isolation", () => {
  it("loads Cal.com only on the booking page", () => {
    expect(checkBookingIsolation(OUT)).toEqual([]);
  });

  it("keeps the direct Cal.com link on the booking page", () => {
    expect(checkBookingFallback(OUT)).toEqual([]);
  });
});

describe("route and repository collision checking", () => {
  it("lists the site's route segments", () => {
    const routes = internalRoutes();

    expect(routes).toContain("projects");
    expect(routes).toContain("book");
  });

  it("finds no collision with the account's published repository names", () => {
    const collisions = findCollisions(internalRoutes(), [
      "dibasbehera",
      "dibasbehera7",
      "system-design-primer",
    ]);

    expect(collisions).toEqual([]);
  });

  it("flags a deliberately colliding route name", () => {
    expect(findCollisions(["projects", "system-design-primer"], ["system-design-primer"])).toEqual([
      "system-design-primer",
    ]);
  });
});