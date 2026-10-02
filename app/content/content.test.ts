import { describe, expect, it } from "vitest";
import { experience } from "./experience";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import { site } from "./site";
import { PROJECT_STATUSES } from "./types";

describe("projects seed data", () => {
  it("contains at least one completed and one in-progress project", () => {
    const statuses = new Set(projects.map((project) => project.status));

    expect(statuses).toContain("completed" satisfies (typeof PROJECT_STATUSES)[number]);
    expect(statuses).toContain("in-progress" satisfies (typeof PROJECT_STATUSES)[number]);
  });

  it("uses only known statuses and unique slugs", () => {
    const slugs = projects.map((project) => project.slug);

    for (const project of projects) {
      expect(PROJECT_STATUSES).toContain(project.status);
      expect(project.body.length).toBeGreaterThan(0);
    }
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("covers a project with no live demo link", () => {
    expect(
      projects.some(
        (project) => !project.links.some((link) => link.label === "Live demo"),
      ),
    ).toBe(true);
  });
});

describe("experience seed data", () => {
  it("provides at least one entry with company, role, and period", () => {
    expect(experience.length).toBeGreaterThan(0);

    for (const entry of experience) {
      expect(entry.company).toBeTruthy();
      expect(entry.role).toBeTruthy();
      expect(entry.period).toBeTruthy();
      expect(entry.highlights.length).toBeGreaterThan(0);
    }
  });
});

describe("skills seed data", () => {
  it("provides at least one non-empty skill group", () => {
    expect(skillGroups.length).toBeGreaterThan(0);
    expect(skillGroups.some((group) => group.skills.length > 0)).toBe(true);
  });
});

describe("site config", () => {
  it("carries identity, contact, and booking details", () => {
    expect(site.name).toBeTruthy();
    expect(site.email).toContain("@");
    expect(site.profiles.length).toBeGreaterThan(0);
    expect(site.booking.provider).toBe("cal");
  });
});