// Compile-time contract checks: each `@ts-expect-error` must remain an error,
// so `tsc --noEmit` fails if the `Project` type stops enforcing the field.
import type { Project } from "./types";

const validProject: Project = {
  slug: "example",
  title: "Example",
  summary: "An example project.",
  status: "completed",
  tags: ["Java"],
  links: [{ label: "Repository", url: "https://example.com" }],
  body: ["Body paragraph."],
};

// @ts-expect-error - `slug` is required because it forms the detail URL.
const missingSlug: Project = { ...validProject, slug: undefined };

// @ts-expect-error - `status` must be one of the known lifecycle states.
const unknownStatus: Project = { ...validProject, status: "archived" };

// @ts-expect-error - `tags` is required and must be an array of strings.
const wrongTags: Project = { ...validProject, tags: "Java" };

// @ts-expect-error - each link needs both a label and a URL.
const partialLink: Project = { ...validProject, links: [{ label: "Repository" }] };

// @ts-expect-error - `summary` is required.
const missingSummary: Project = { ...validProject, summary: undefined };

export const contractCases = {
  validProject,
  missingSlug,
  unknownStatus,
  wrongTags,
  partialLink,
  missingSummary,
};