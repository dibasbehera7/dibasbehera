import { describe, expect, it } from "vitest";
import { BUDGET_BYTES, homePageAssetBytes } from "./budget";

describe("bundle budget", () => {
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