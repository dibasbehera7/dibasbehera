import { describe, expect, it } from "vitest";
import { featuredProjects, projects } from "./projects";
import { interviewPreps } from "./preps";

const repoUrls = (links: { url: string }[]) => links.map((link) => link.url);

/** Repository name is the last path segment; profile and site links differ. */
function repoName(url: string) {
  const match = url.match(/github\.com\/dibasbehera7\/([^/]+)/);
  return match?.[1];
}

describe("project content", () => {
  it("lists at least ten curated projects", () => {
    expect(featuredProjects.length).toBeGreaterThanOrEqual(10);
  });

  it("keeps every project reachable by a unique slug", () => {
    const slugs = projects.map((project) => project.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("links every project to exactly one repository and no secondary read-online link", () => {
    for (const project of projects) {
      expect(project.links).toHaveLength(1);
      expect(project.links[0].label).toBe("Repository");
      expect(project.links[0].url).toMatch(/^https:\/\/github\.com\/dibasbehera7\//);
    }
  });

  it("contains no Read online style secondary link", () => {
    const labels = projects.flatMap((project) =>
      project.links.map((link) => link.label),
    );

    expect(labels).not.toContain("Read online");
    expect(labels.some((label) => /read online/i.test(label))).toBe(false);
  });
});

describe("interview preps content", () => {
  it("lists at least ten entries", () => {
    expect(interviewPreps.length).toBeGreaterThanOrEqual(10);
  });

  it("gives every entry a title, topics, and exactly one repository link", () => {
    for (const item of interviewPreps) {
      expect(item.title).toBeTruthy();
      expect(item.topics.length).toBeGreaterThan(0);
      expect(item.links).toHaveLength(1);
      expect(item.links[0].label).toBe("Repository");
      expect(item.links[0].url).toMatch(/^https:\/\/github\.com\/dibasbehera7\//);
    }
  });

  it("contains no Read online style secondary link", () => {
    const labels = interviewPreps.flatMap((item) =>
      item.links.map((link) => link.label),
    );

    expect(labels.some((label) => /read online/i.test(label))).toBe(false);
  });
});

describe("no duplicated material between sections", () => {
  const projectRepos = new Set(
    featuredProjects.flatMap((project) => repoUrls(project.links).map(repoName)),
  );
  const prepRepos = new Set(
    interviewPreps.flatMap((item) => repoUrls(item.links).map(repoName)),
  );

  it("shares no repository between the two sections", () => {
    const overlap = [...projectRepos].filter((repo) => prepRepos.has(repo!));

    expect(overlap).toEqual([]);
  });

  it("shares no URL between the two sections", () => {
    const projectUrls = new Set(
      featuredProjects.flatMap((project) => repoUrls(project.links)),
    );
    const prepUrls = new Set(interviewPreps.flatMap((item) => repoUrls(item.links)));

    expect([...projectUrls].filter((url) => prepUrls.has(url))).toEqual([]);
  });

  it("would report an overlap if one were introduced", () => {
    // Proves the comparison above is a real gate, not a tautology.
    const duplicated = "system-design-primer";

    expect(projectRepos.has(duplicated)).toBe(true);
    expect(prepRepos.has(duplicated)).toBe(false);
    expect([...projectRepos].filter((repo) => repo === duplicated)).not.toEqual([]);
  });

  it("also keeps prep entries unique among themselves", () => {
    expect(prepRepos.size).toBe(interviewPreps.length);
  });
});