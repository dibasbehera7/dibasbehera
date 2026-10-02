import { internalRoutes, findCollisions } from "./checks";

/**
 * GitHub Pages serves each repository at `<login>.github.io/<repo-name>/`, so a
 * route segment that matches a Pages-enabled repository name would put two sites
 * on the same URL path. This guard compares the site's routes against the
 * account's repositories and fails on a collision.
 */
async function main() {
  const owner = process.env.GH_OWNER ?? "dibasbehera7";

  const response = await fetch(
    `https://api.github.com/users/${owner}/repos?per_page=100&type=owner`,
    { headers: { Accept: "application/vnd.github+json" } },
  );

  if (!response.ok) {
    console.log(
      `Could not list repositories for ${owner} (${response.status}); skipping collision check.`,
    );
    return;
  }

  const repos = (await response.json()) as { name: string }[];

  // Repositories that actually occupy a sub-path on the account's Pages domain.
  const published = repos
    .map((repo) => repo.name)
    .filter((name) => name !== `${owner}.github.io`);

  const collisions = findCollisions(internalRoutes(), published);

  console.log(
    `Checked routes ${internalRoutes().join(", ")} against ${published.length} repositories.`,
  );

  if (collisions.length > 0) {
    console.error(
      `\n✗ Route names collide with published project sites: ${collisions.join(", ")}`,
    );
    console.error(
      "  Rename the route or the repository so exactly one site owns that URL path.",
    );
    process.exitCode = 1;
    return;
  }

  console.log("No route collisions found.");
}

void main();