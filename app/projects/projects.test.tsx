import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFound from "@/not-found";
import ProjectDetailPage, { generateStaticParams } from "./[slug]/page";
import { projects } from "@/content/projects";

const notFound = vi.hoisted(() =>
  vi.fn(() => {
    // Real `notFound()` throws a control-flow error; the mock must too, or the
    // component keeps rendering with an undefined project.
    throw new Error("NEXT_NOT_FOUND");
  }),
);

vi.mock("next/navigation", () => ({ notFound }));

async function renderProject(slug: string) {
  return render(await ProjectDetailPage({ params: Promise.resolve({ slug }) }));
}

describe("generateStaticParams", () => {
  it("emits one route per configured project", () => {
    expect(generateStaticParams()).toEqual(
      projects.map((project) => ({ slug: project.slug })),
    );
  });
});

describe("project detail page", () => {
  it("renders title, summary, tags, status, and outbound links", async () => {
    const project = projects[0];
    await renderProject(project.slug);

    expect(
      screen.getByRole("heading", { level: 1, name: project.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();
    for (const tag of project.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
    for (const link of project.links) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.url,
      );
    }
  });

  it("shows each body paragraph", async () => {
    const project = projects[0];
    await renderProject(project.slug);

    for (const paragraph of project.body) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("labels in-progress work as In progress", async () => {
    const ongoing = projects.find((project) => project.status === "in-progress");
    await renderProject(ongoing!.slug);

    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it("triggers the not-found path for an unknown slug", async () => {
    await expect(renderProject("does-not-exist")).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
    expect(notFound).toHaveBeenCalled();
  });

  it("links back to the home page", async () => {
    await renderProject(projects[0].slug);

    expect(
      screen.getByRole("link", { name: /back to all projects/i }),
    ).toBeInTheDocument();
  });
});

describe("not-found page", () => {
  it("explains the page is missing and links home", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { level: 1, name: /page not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to the home page/i }),
    ).toHaveAttribute("href", "/");
  });
});