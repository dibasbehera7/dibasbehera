import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Contact } from "./Contact";
import { Experience } from "./Experience";
import { Intro } from "./Intro";
import { ProjectShowcase } from "./ProjectShowcase";
import { Skills } from "./Skills";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { site } from "@/content/site";
import type { Project } from "@/content/types";
import HomePage from "@/page";

const stubProject: Project = {
  slug: "stub",
  title: "Stub Project",
  summary: "A stub used for component assertions.",
  status: "completed",
  tags: ["Java"],
  links: [{ label: "Repository", url: "https://example.com/stub" }],
  body: ["Body paragraph."],
};

describe("Intro", () => {
  it("renders the owner's name, role, and introduction text", () => {
    render(<Intro site={site} />);

    expect(screen.getByRole("heading", { name: site.name })).toBeInTheDocument();
    expect(screen.getByText(site.role)).toBeInTheDocument();
    expect(screen.getByText(site.introduction)).toBeInTheDocument();
  });
});

describe("ProjectShowcase", () => {
  it("renders a card per project with its title, summary, and tags", () => {
    render(<ProjectShowcase projects={[stubProject]} />);

    expect(
      screen.getByRole("heading", { name: "Stub Project" }),
    ).toBeInTheDocument();
    // Card content also appears in the card's dialog, so assert presence.
    expect(screen.getAllByText(stubProject.summary).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Java").length).toBeGreaterThan(0);
  });

  it("exposes a control that opens the card details", () => {
    render(<ProjectShowcase projects={[stubProject]} />);

    expect(
      screen.getByRole("button", { name: "Show details for Stub Project" }),
    ).toBeInTheDocument();
  });

  it("renders no demo anchor when a project has no demo link", () => {
    const noDemo: Project = {
      ...stubProject,
      links: [{ label: "Repository", url: "https://example.com/stub" }],
    };
    render(<ProjectShowcase projects={[noDemo]} />);

    expect(screen.queryByRole("link", { name: /demo/i })).not.toBeInTheDocument();
  });

  it("exposes in-progress status as text, not colour alone", () => {
    const ongoing: Project = { ...stubProject, status: "in-progress" };
    render(<ProjectShowcase projects={[ongoing]} />);

    const labels = screen.getAllByText("In progress");
    expect(labels.length).toBeGreaterThan(0);
    expect(labels[0]).toHaveAttribute("data-status", "in-progress");
  });

  it("labels completed work as Completed", () => {
    render(<ProjectShowcase projects={[stubProject]} />);

    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
  });

  it("offers no full project page link in the dialog", async () => {
    render(<ProjectShowcase projects={[stubProject]} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Show details for Stub Project" }),
    );

    expect(
      screen.queryByRole("link", { name: /open the full project page/i }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Repository" }).length).toBeGreaterThan(0);
  });
  it("renders a control for each configured project", () => {
    render(<ProjectShowcase projects={projects} />);

    for (const project of projects) {
      expect(
        screen.getByRole("button", { name: `Show details for ${project.title}` }),
      ).toBeInTheDocument();
    }
  });
});
describe("Skills", () => {
  it("renders every configured skill", () => {
    render(<Skills skillGroups={skillGroups} />);

    for (const group of skillGroups) {
      expect(screen.getByText(group.category)).toBeInTheDocument();
      for (const skill of group.skills) {
        expect(screen.getByText(skill)).toBeInTheDocument();
      }
    }
  });
});

describe("Experience", () => {
  it("renders entries in configured order", () => {
    render(<Experience experience={experience} />);

    const rendered = screen
      .getAllByRole("listitem")
      .map((item) => item.querySelector("h3")?.textContent ?? "")
      .filter(Boolean);

    expect(rendered).toEqual(
      experience.map((entry) => `${entry.role}, ${entry.company}`),
    );
  });

  it("renders the period and domain for each entry", () => {
    render(<Experience experience={experience} />);

    for (const entry of experience) {
      expect(screen.getByText(entry.period)).toBeInTheDocument();
      expect(screen.getByText(entry.domain)).toBeInTheDocument();
    }
  });
});

describe("Contact", () => {
  it("offers a booking link and no social profile links", () => {
    render(<Contact />);

    expect(
      screen.getByRole("link", { name: /book a 1:1 session/i }),
    ).toHaveAttribute("href", "/book");
    expect(screen.queryByRole("link", { name: "GitHub" })).not.toBeInTheDocument();
    expect(document.querySelector("a[href^='mailto:']")).toBeNull();
  });
});
describe("home page section order", () => {
  it("renders the sections in the specified order as landmarks", () => {
    const { container } = render(<HomePage />);

    const sections = Array.from(
      container.querySelectorAll("main > section"),
      (section) => section.getAttribute("aria-labelledby"),
    );

    expect(sections).toEqual([
      "intro-heading",
      "projects-heading",
      "preps-heading",
      "skills-heading",
      "experience-heading",
      "contact-heading",
    ]);
  });
});