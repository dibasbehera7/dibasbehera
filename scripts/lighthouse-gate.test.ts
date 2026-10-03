import { describe, expect, it } from "vitest";

// The Lighthouse gate is plain ESM on purpose, so it is imported dynamically.
const { failingAudits } = await import("./lighthouse-gate.mjs");

const lhr = {
  categories: {
    accessibility: {
      auditRefs: [
        { id: "color-contrast" },
        { id: "target-size" },
        { id: "passing-audit" },
      ],
    },
  },
  audits: {
    "passing-audit": { score: 1, title: "Fine" },
    "target-size": {
      score: 0,
      scoreDisplayMode: "binary",
      title: "Touch targets do not have sufficient size or spacing.",
      details: {
        items: [
          {
            node: { snippet: '<a class="tag" href="/x">Go</a>' },
            relatedNode: { snippet: '<button class="next">Next</button>' },
          },
        ],
      },
    },
    "color-contrast": {
      score: null,
      scoreDisplayMode: "notApplicable",
      title: "Not applicable",
    },
  },
};

describe("failingAudits", () => {
  it("names each audit that scored below one", () => {
    const lines = failingAudits(lhr, "accessibility");

    expect(lines[0]).toContain("target-size");
    expect(lines[0]).toContain("score 0");
  });

  it("includes the offending nodes so the failure is actionable", () => {
    const lines = failingAudits(lhr, "accessibility");

    expect(lines.join("\n")).toContain('<a class="tag" href="/x">Go</a>');
    expect(lines.join("\n")).toContain('<button class="next">Next</button>');
  });

  it("omits passing audits and audits with no score", () => {
    const output = failingAudits(lhr, "accessibility").join("\n");

    expect(output).not.toContain("Fine");
    expect(output).not.toContain("Not applicable");
  });

  it("returns nothing for a missing category", () => {
    expect(failingAudits(lhr, "does-not-exist")).toEqual([]);
    expect(failingAudits(undefined, "accessibility")).toEqual([]);
  });
});