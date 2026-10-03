import { homePageAssetBytes, homePageAssetFiles, BUDGET_BYTES } from "./budget";
import { checkInternalLinks, checkBookingIsolation, checkBookingPage } from "./checks";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const format = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

function fail(title: string, problems: string[]): never {
  console.error(`\n✗ ${title}`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

const { bytes, transferBytes, fileCount } = homePageAssetBytes();
const files = homePageAssetFiles();
console.log(`Bundle budget: ${format(transferBytes)} transfer (${format(bytes)} raw) of ${format(BUDGET_BYTES)} across ${fileCount} files`);
for (const file of files) console.log(`  ${file}`);

if (transferBytes > BUDGET_BYTES) {
  fail(`JS + CSS transfer budget exceeded (${format(transferBytes)} > ${format(BUDGET_BYTES)})`, files);
}

const links = checkInternalLinks(undefined, basePath === "" ? "" : basePath);
console.log(`\nInternal links: checked ${links.checked} pages`);
if (links.problems.length > 0) fail("Broken internal links", links.problems);

const isolated = checkBookingIsolation();
if (isolated.length > 0) fail("Booking embed leaked outside /book", isolated);

const booking = checkBookingPage();
if (booking.length > 0) fail("Booking page check failed", booking);

console.log("\nAll static site checks passed.");