import { describe, expect, it } from "vitest";
import { featuredProjects } from "@/content/projects";
import { interviewPreps } from "@/content/preps";

const urls = [
  ...featuredProjects.flatMap((project) => project.links.map((link) => link.url)),
  ...interviewPreps.flatMap((item) => item.links.map((link) => link.url)),
];

const ONLINE =
  process.env.CHECK_EXTERNAL_LINKS === "1" ? describe : describe.skip;

ONLINE("external repository links", () => {
  it(
    "all resolve successfully",
    async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          try {
            const response = await fetch(url, {
              redirect: "follow",
              headers: { "User-Agent": "portfolio-link-check" },
            });
            return { url, status: response.status };
          } catch {
            return { url, status: 0 };
          }
        }),
      );

      const broken = results.filter((result) => result.status !== 200);

      expect(broken).toEqual([]);
    },
    60_000,
  );
});

describe("external link inventory", () => {
  it("collects every configured repository URL", () => {
    expect(urls.length).toBe(featuredProjects.length + interviewPreps.length);
  });

  it("covers a meaningful number of links", () => {
    expect(urls.length).toBeGreaterThanOrEqual(20);
  });
});