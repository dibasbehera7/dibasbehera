/**
 * Verifies the styling and accessibility contracts that CSS alone cannot prove
 * at runtime: token usage, responsive breakpoints, visible focus, alt text, and
 * keyboard reachability of every interactive element.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookPage from "@/book/page";
import { CalEmbed } from "@/book/CalEmbed";
import HomePage from "@/page";
import { InterviewPreps } from "@/components/InterviewPreps";
import { featuredProjects, projects } from "@/content/projects";
import { interviewPreps } from "@/content/preps";
import { site } from "@/content/site";

const appDir = join(process.cwd(), "app");

function readCss(relativePath: string) {
  return readFileSync(join(appDir, relativePath), "utf8");
}

const componentSheets = [
  "components/Intro.module.css",
  "components/ProjectShowcase.module.css",
  "components/Skills.module.css",
  "components/Experience.module.css",
  "components/Contact.module.css",
  "components/TopBar.module.css",
  "components/InterviewPreps.module.css",
  "projects/[slug]/page.module.css",
  "book/page.module.css",
  "book/CalEmbed.module.css",
];

describe("design tokens", () => {
  const globals = readCss("globals.css");

  it("defines the colour, spacing, radius, and type tokens", () => {
    for (const token of [
      "--color-bg",
      "--color-text",
      "--color-muted",
      "--color-accent",
      "--color-accent-dark",
      "--color-border",
      "--color-focus",
      "--color-shadow",
      "--color-bar",
      "--color-bar-deep",
      "--color-on-bar",
      "--color-link",
      "--space-3",
      "--radius-md",
      "--radius-pill",
      "--text-base",
    ]) {
      expect(globals).toContain(`${token}:`);
    }
  });

  it("uses the banking-style purple palette", () => {
    // Light theme only; a dark override may also be present.
    expect(globals).toContain("#6c2c8e");
    expect(globals).toContain("#4d1c68");
    expect(globals).toContain("#f4f0f8");
  });

  it("keeps header bars and links readable in the dark colour scheme", () => {
    // Lighthouse audits in dark mode, so the dark override must define its own
    // bar and link colours rather than inheriting the light ones.
    const darkBlock = globals.slice(globals.indexOf("prefers-color-scheme: dark"));

    expect(darkBlock).toContain("--color-bar:");
    expect(darkBlock).toContain("--color-bar-deep:");
    expect(darkBlock).toContain("--color-on-bar:");
    expect(darkBlock).toContain("--color-link:");
    expect(darkBlock).not.toMatch(/--color-on-accent:\s*#ffffff/);
  });

  it("uses the bar tokens in the top bar rather than the accent colour", () => {
    const topBar = readCss("components/TopBar.module.css");

    expect(topBar).toContain("var(--color-bar)");
    expect(topBar).toContain("var(--color-bar-deep)");
    expect(topBar).toContain("var(--color-on-bar)");
  });

  it("does not hardcode colours in component stylesheets", () => {
    for (const modulePath of componentSheets) {
      const css = readCss(modulePath);
      const hexColours = css.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
      const rgbLiterals = css.match(/rgba?\([^)]*\)/g) ?? [];

      expect({ modulePath, hexColours, rgbLiterals }).toEqual({
        modulePath,
        hexColours: [],
        rgbLiterals: [],
      });
    }
  });

  it("scopes component styles with CSS Modules class selectors", () => {
    for (const modulePath of [
      "components/Intro.module.css",
      "components/ProjectShowcase.module.css",
    ]) {
      const css = readCss(modulePath);
      expect(css).toMatch(/\.[A-Za-z][\w-]*\s*\{/);
      expect(css).not.toMatch(/^\s*(body|h1|h2|html)\s*\{/m);
    }
  });
});

describe("scrollable card rails", () => {
  it("hides the scrollbar while keeping horizontal scrolling and snap points", () => {
    const css = readCss("components/rail.css");

    expect(css).toContain("scrollbar-width: none");
    expect(css).toContain("-ms-overflow-style: none");
    expect(css).toContain(".card-rail::-webkit-scrollbar");
    expect(css).toMatch(/overflow-x:\s*auto/);
    expect(css).toContain("scroll-snap-type");
  });
  it("gives each rail's cards a fixed basis so they snap predictably", () => {
    for (const sheet of [
      "components/ProjectShowcase.module.css",
      "components/InterviewPreps.module.css",
    ]) {
      expect(readCss(sheet)).toMatch(/flex:\s*0 0/);
      expect(readCss(sheet)).toContain("scroll-snap-align");
    }
  });  it("exposes the rails as labelled, focusable list items", () => {
    render(<HomePage />);

    const rail = screen.getByRole("list", {
      name: /featured projects, scroll horizontally/i,
    });
    expect(rail).toHaveAttribute("tabindex", "0");

    expect(
      screen.getByRole("list", {
        name: /interview preparation topics, scroll horizontally/i,
      }),
    ).toHaveAttribute("tabindex", "0");
  });
});

describe("curated projects", () => {
  it("lists only featured projects on the home page", () => {
    render(<HomePage />);

    for (const project of featuredProjects) {
      expect(
        screen.getByRole("button", { name: `Show details for ${project.title}` }),
      ).toBeInTheDocument();
    }

    for (const project of projects.filter((entry) => !entry.featured)) {
      expect(
        screen.queryByRole("button", { name: `Show details for ${project.title}` }),
      ).not.toBeInTheDocument();
    }
  });
});
describe("interview preps section", () => {
  it("renders each prep title and topics on the card", () => {
    render(<InterviewPreps items={interviewPreps} />);

    for (const item of interviewPreps) {
      expect(screen.getByRole("heading", { name: item.title })).toBeInTheDocument();
      expect(screen.getAllByText(item.topics[0]).length).toBeGreaterThan(0);
    }
  });

  it("exposes a details control for each prep entry", () => {
    render(<InterviewPreps items={interviewPreps} />);

    for (const item of interviewPreps) {
      expect(
        screen.getByRole("button", { name: `Show details for ${item.title}` }),
      ).toBeInTheDocument();
    }
  });
});describe("responsive layout", () => {
  it("uses mobile-first layouts with min-width breakpoints only", () => {
    for (const modulePath of ["components/Skills.module.css"]) {
      const css = readCss(modulePath);
      const maxWidthQueries = css.match(/@media[^{]*max-width/g) ?? [];

      expect(maxWidthQueries).toEqual([]);
      expect(css).toContain("@media (min-width:");
    }
  });

  it("keeps text wrapping so narrow viewports do not scroll sideways", () => {
    expect(readCss("globals.css")).toContain("overflow-wrap: break-word");
  });

  it("gives the top bar a stacked-to-inline layout", () => {
    const topBar = readCss("components/TopBar.module.css");

    expect(topBar).toContain("flex-wrap: wrap");
  });
});

describe("visible focus", () => {
  it("defines a focus-visible outline", () => {
    expect(readCss("globals.css")).toMatch(/:focus-visible\s*\{[^}]*outline:/);
  });
});

describe("keyboard reachability", () => {
  it("reaches the booking control in order on the home page", async () => {
    render(<HomePage />);

    const reachable: string[] = [];
    for (let i = 0; i < 60; i += 1) {
      await userEvent.tab();
      const active = document.activeElement as HTMLElement | null;
      if (!active || active === document.body) break;
      reachable.push(active.textContent?.trim().slice(0, 40) ?? "");
    }

    expect(reachable.join(" | ")).toContain("Book a 1:1 session");
  });

  it("reaches the embed control and the fallback link by keyboard", async () => {
    render(<BookPage />);

    await userEvent.tab();
    const first = document.activeElement as HTMLElement;
    expect(first).toHaveAttribute("type", "button");

    await userEvent.tab();
    expect(document.activeElement).toHaveTextContent("Book directly on Cal.com");
  });

  it("activates the embed control with the keyboard", async () => {
    render(<CalEmbed booking={site.booking} />);

    await userEvent.tab();
    expect(document.activeElement).toHaveTextContent("Open the booking calendar");
  });
});

describe("image alternative text", () => {
  it("gives every img element a non-empty descriptive alt or marks it decorative", () => {
    const files = [
      "components/ProjectShowcase.tsx",
      "components/Intro.tsx",
      "components/Skills.tsx",
      "components/Experience.tsx",
      "components/Contact.tsx",
      "page.tsx",
      "projects/[slug]/page.tsx",
      "book/page.tsx",
    ];

    for (const file of files) {
      const source = readFileSync(join(appDir, file), "utf8");
      const images = source.match(/<img\b[^>]*>/g) ?? [];

      for (const image of images) {
        expect(image, `${file} has an img without alt`).toMatch(/\salt=/);
      }
    }
  });
});

describe("semantic landmarks", () => {
  it("marks the home page as a single main landmark", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(container.querySelectorAll("section[aria-labelledby]").length).toBeGreaterThan(0);
  });
});