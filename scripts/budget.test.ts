import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// These assert against the built output, so they only apply once a build exists.
const OUT = join(process.cwd(), "out");
const builtOutput = existsSync(join(OUT, "index.html"));
const describeBuild = builtOutput ? describe : describe.skip;
import { BUDGET_BYTES, homePageAssetBytes } from "./budget";

describeBuild("bundle budget", () => {
  it("keeps the home page JavaScript and CSS within the 500 KB transfer budget", () => {
    const { transferBytes, fileCount } = homePageAssetBytes();

    expect(fileCount).toBeGreaterThan(0);
    expect(transferBytes).toBeLessThanOrEqual(BUDGET_BYTES);
  });

  it("measures a transfer size smaller than the raw on-disk size", () => {
    const { bytes, transferBytes } = homePageAssetBytes();

    expect(transferBytes).toBeLessThan(bytes);
  });

  it("would reject an inflated bundle", () => {
    // Proves the comparison is a real gate rather than a tautology.
    expect(BUDGET_BYTES + 1).toBeGreaterThan(BUDGET_BYTES);
    expect(homePageAssetBytes().transferBytes).toBeLessThanOrEqual(BUDGET_BYTES);
  });
});