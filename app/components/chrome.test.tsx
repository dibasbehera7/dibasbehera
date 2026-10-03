import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/page";
import { Footer } from "./Footer";
import { TopBar } from "./TopBar";
import { featuredProjects } from "@/content/projects";
import { interviewPreps } from "@/content/preps";
import { site } from "@/content/site";

const read = (file: string) => readFileSync(join(process.cwd(), "app", file), "utf8");

describe("header", () => {
  it("renders a single navigation tier with no utility bar", () => {
    render(<TopBar site={site} />);

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(document.querySelectorAll("header nav")).toHaveLength(1);
    // The removed utility bar carried the tagline; it must not appear in the header.
    expect(
      within(screen.getByRole("banner")).queryByText(site.tagline),
    ).not.toBeInTheDocument();
  });

  it("does not render an email address", () => {
    render(<TopBar site={site} />);

    expect(screen.queryByText(site.email)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: site.email })).not.toBeInTheDocument();
  });

  it("links to the home page, both sections, and the booking page", () => {
    render(<TopBar site={site} />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(within(nav).getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/#projects",
    );
    expect(
      within(nav).getByRole("link", { name: "Interview Preps" }),
    ).toHaveAttribute("href", "/#preps");
    expect(
      within(nav).getByRole("link", { name: "Book a Session" }),
    ).toHaveAttribute("href", "/book");
  });

  it("is styled to stick to the top of the viewport", () => {
    const css = read("components/TopBar.module.css");

    expect(css).toMatch(/position:\s*sticky/);
    expect(css).toMatch(/top:\s*0/);
    expect(css).toContain("z-index");
  });

  it("spaces adjacent navigation targets far enough apart", () => {
    const css = read("components/TopBar.module.css");
    const gap = css.match(/\.navList\s*\{[^}]*gap:\s*var\(--space-(\d)\)/);

    expect(gap).not.toBeNull();
    // --space-4 is 1.5rem (24px), the minimum spacing WCAG 2.2 expects
    // between adjacent touch targets.
    expect(gap![1]).toBe("4");
  });});

describe("footer", () => {
  it("renders a heart and an Indian flag with accessible labels", () => {
    render(<Footer site={site} />);

    expect(screen.getByRole("img", { name: "love" })).toHaveTextContent("❤️");
    expect(screen.getByRole("img", { name: "India" })).toHaveTextContent("🇮🇳");
  });

  it("credits GitHub with a link to the owner's profile", () => {
    render(<Footer site={site} />);

    const link = screen.getByRole("link", { name: /@github/i });
    expect(link).toHaveAttribute("href", "https://github.com/dibasbehera7");
  });

  it("renders as a contentinfo landmark", () => {
    render(<Footer site={site} />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});

describe("no email anywhere on the page", () => {
  it("renders no mailto link and shows no email address", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(container.innerHTML).not.toContain("dibasbehera@gmail.com");
  });
});

describe("scroll rails", () => {
  it("ships the shared rail styles as plain CSS, not as a module", () => {
    const rail = read("components/rail.css");

    expect(rail).toContain(".card-rail-wrapper");
    expect(rail).toMatch(/\.card-rail\s*\{/);
    expect(rail).toMatch(/overflow-x:\s*auto/);
    expect(rail).toContain("scroll-snap-type");
    expect(rail).toContain("scrollbar-width: none");
    expect(rail).toContain("-ms-overflow-style: none");
    expect(rail).toContain(".card-rail::-webkit-scrollbar");

    // Imported by globals so the plain class names reach every component.
    expect(read("globals.css")).toContain("@import './components/rail.css'");

    // No component may import a CSS module from another module: scoped class
    // names are not re-exported, which silently drops the classes.
    for (const sheet of [
      "components/ProjectShowcase.module.css",
      "components/InterviewPreps.module.css",
    ]) {
      expect(read(sheet)).not.toContain("@import");
    }
  });

  it("applies the rail classes to the rendered elements", () => {
    render(<HomePage />);

    for (const label of [
      /featured projects, scroll horizontally/i,
      /interview preparation topics, scroll horizontally/i,
    ]) {
      const rail = screen.getByRole("list", { name: label });
      expect(rail).toHaveClass("card-rail");
      expect(rail).toHaveAttribute("tabindex", "0");
      expect(rail.parentElement).toHaveClass("card-rail-wrapper");
    }
  });

  it("gives each rail's cards a fixed basis so they snap predictably", () => {
    for (const sheet of [
      "components/ProjectShowcase.module.css",
      "components/InterviewPreps.module.css",
    ]) {
      expect(read(sheet)).toMatch(/flex:\s*0 0/);
      expect(read(sheet)).toContain("scroll-snap-align");
      expect(read(sheet)).toContain("position: relative");
    }
  });

  it("exposes labelled previous and next arrows on both rails", () => {
    render(<HomePage />);

    for (const name of [
      /scroll featured projects backwards/i,
      /scroll featured projects forwards/i,
      /scroll interview preparation topics backwards/i,
      /scroll interview preparation topics forwards/i,
    ]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("disables the backward arrow while a rail is at its start", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("button", { name: /scroll featured projects backwards/i }),
    ).toBeDisabled();
  });

  it("scrolls a rail by one card when the next arrow is activated", async () => {
    render(<HomePage />);

    const rail = document.getElementById("projects-rail")!;
    let scrollLeft = 0;
    Object.defineProperties(rail, {
      scrollWidth: { value: 2000, configurable: true },
      clientWidth: { value: 500, configurable: true },
    });
    Object.defineProperty(rail, "scrollLeft", {
      get: () => scrollLeft,
      set: (value: number) => {
        scrollLeft = value;
      },
      configurable: true,
    });
    const scrollBy = vi.fn();
    Object.defineProperty(rail, "scrollBy", { value: scrollBy, configurable: true });

    rail.dispatchEvent(new Event("scroll"));
    const forward = screen.getByRole("button", {
      name: /scroll featured projects forwards/i,
    });
    await waitFor(() => expect(forward).toBeEnabled());

    await userEvent.click(forward);

    expect(scrollBy).toHaveBeenCalledTimes(1);
    expect(scrollBy.mock.calls[0][0]).toMatchObject({ behavior: "smooth" });
  });
});
describe("repository links are buttons", () => {
  it("renders the repository link as a button-styled anchor", () => {
    render(<HomePage />);

    const link = screen.getAllByRole("link", { name: "Repository" })[0];
    expect(link).toHaveAttribute("href", featuredProjects[0].links[0].url);
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));

    const showcaseCss = read("components/ProjectShowcase.module.css");
    expect(showcaseCss).toMatch(/\.linkButton\s*\{/);
    expect(showcaseCss).toMatch(/display:\s*inline-block/);
  });

  it("does not stack a second interactive element over the card", () => {
    const showcaseCss = read("components/ProjectShowcase.module.css");
    const prepsCss = read("components/InterviewPreps.module.css");

    for (const css of [showcaseCss, prepsCss]) {
      // One control per card: the title button, stretched with a pseudo element.
      expect(css).toContain(".cardButton::after");
      expect(css).not.toContain(".overlay");
      // The link stays above the stretched title button so it remains clickable.
      expect(css).toMatch(/\.links\s*\{[^}]*z-index:\s*2/);
      expect(css).toMatch(/\.cardButton::after\s*\{[^}]*z-index:\s*1/);
    }
  });});

describe("card dialogs", () => {
  const openFirstProject = async () => {
    render(<HomePage />);

    await userEvent.click(
      screen.getByRole("button", {
        name: `Show details for ${featuredProjects[0].title}`,
      }),
    );

    return screen.getByRole("dialog", {
      name: `Show details for ${featuredProjects[0].title}`,
    });
  };

  it("opens in place without navigating away", async () => {
    await openFirstProject();

    expect(document.querySelector("dialog")?.hasAttribute("open")).toBe(true);
  });

  it("exposes an accessible name and a close control", async () => {
    const dialog = await openFirstProject();

    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: /close details/i }),
    ).toBeInTheDocument();
  });

  it("shows the project status, tags, body, and repository in the dialog", async () => {
    const dialog = await openFirstProject();
    const project = featuredProjects[0];

    for (const paragraph of project.body) {
      expect(within(dialog).getByText(paragraph)).toBeInTheDocument();
    }
    expect(within(dialog).getByText(project.tags[0])).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "Repository" })).toHaveAttribute(
      "href",
      project.links[0].url,
    );
  });

  it("keeps the detail page reachable from the dialog", async () => {
    const dialog = await openFirstProject();

    expect(
      within(dialog).getByRole("link", { name: /open the full project page/i }),
    ).toHaveAttribute("href", `/projects/${featuredProjects[0].slug}`);
  });

  it("closes when the close control is activated", async () => {
    const dialog = await openFirstProject();

    await userEvent.click(
      within(dialog).getByRole("button", { name: /close details/i }),
    );

    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("opens and closes an interview preparation dialog", async () => {
    render(<HomePage />);

    const prep = interviewPreps[0];
    await userEvent.click(
      screen.getByRole("button", { name: `Show details for ${prep.title}` }),
    );

    const dialog = screen.getByRole("dialog", {
      name: `Show details for ${prep.title}`,
    });
    expect(
      within(dialog).getByRole("link", { name: "Repository" }),
    ).toHaveAttribute("href", prep.links[0].url);
    expect(within(dialog).getByText(prep.topics[0])).toBeInTheDocument();

    await userEvent.click(
      within(dialog).getByRole("button", { name: /close details/i }),
    );
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("ships only one dialog per section rather than one per card", () => {
    render(<HomePage />);

    expect(document.querySelectorAll("dialog")).toHaveLength(2);
  });
});
describe("expanded content on the home page", () => {
  it("lists at least ten project cards", () => {
    render(<HomePage />);

    expect(featuredProjects.length).toBeGreaterThanOrEqual(10);
    expect(
      screen.getAllByRole("listitem", { name: "" }).length,
    ).toBeGreaterThanOrEqual(featuredProjects.length);
  });
});
