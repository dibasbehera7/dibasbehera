# Design

## Context

The repository is currently empty of application code (see `proposal.md` - Why). Project conventions indicate a React/Next.js-oriented stack. The site must be published as a static build to GitHub Pages, which has no server runtime and serves from a repository subpath.

**Context addition:** a public Cal.com account already exists at `https://cal.com/dibasbehera` with paid-session pricing enabled, so booking is executed by that provider.

## Goals / Non-Goals

**Goals:**
- Static, cacheable output deployable to GitHub Pages with no server runtime.
- Content separated from presentation so adding a project is a data-only edit.
- Automated build → verify → publish on merge to the default branch.
- A booking path to the existing Cal.com account that survives script failure.

**Non-Goals:**
- No CMS, database, or admin UI.
- No server-side rendering at request time.
- No scheduling, availability, notification, or payment logic of our own — Cal.com owns all of it.

## Decisions

**Next.js static export vs. plain static HTML (Astro/Hugo) vs. hand-written HTML.**
Chosen: Next.js `output: 'export'`. The project stack already names Next.js/React, so tooling, component reuse, and future additions (e.g. a booking route) stay idiomatic. Astro would ship less JavaScript but introduces a second framework into a React-oriented project. Hand-written HTML is cheapest but makes per-project detail pages and later interactive additions costly. Trade-off: a JS runtime cost, contained by the performance budget requirement.

**Content model: typed local data files over MDX.**
Chosen: a typed TypeScript data module (`projects`, `experience`, `skills`, `site`) with a `Project` shape including `slug`, `title`, `summary`, `status: 'completed' | 'in-progress'`, `tags`, `links`, `body`. Typed data gives compile-time validation and lets specs be tested as pure functions; MDX would allow arbitrary content but weakens validation and adds a content dependency. URLs derive from `slug` via `generateStaticParams`, satisfying the stable-URL requirement.

**Base path handling.**
GitHub Pages serves project sites under `/<repo>/`, so `basePath`/`assetPrefix` must be configured from a build-time value. Verified account state (via `gh` plus live URL checks): login is `dibasbehera7`; `https://dibasbehera7.github.io` returns **404** and `https://dibasbehera7.github.io/dibasbehera` returns **404** — nothing is published today. The repo named `dibasbehera7.github.io` is private, and Pages is unavailable on private repos on the free plan, so the apex cannot be served from it. The `dibasbehera7` repo is a separate public repo used to showcase git status; it is not this site and is left untouched.

Decision: publish as a **project site at `dibasbehera7.github.io/dibasbehera`**, served by the public `dibasbehera` repo (which is this project), with the prefix supplied by a single build-time env value (`NEXT_PUBLIC_BASE_PATH`, empty for local dev and for a future apex deployment). The sub-path is derived from the repository name, so no other repo name can claim `/dibasbehera`. Moving to the apex later is a build-value change plus a repo decision, not a code change. Trade-off accepted: the public URL carries `/dibasbehera`, which is also the more descriptive of the two URLs.

**Multi-site layout: many sites per account, one apex.**
GitHub Pages allows one site per repository. Any repo other than `<login>.github.io` is served at `<login>.github.io/<repo-name>/`, so root and `/profolio` can coexist under the same domain. Apex is exclusive; sub-path project sites are not. Note for later: attaching a custom domain to the apex site does not by itself move project sites onto that domain, so a future "independent root" needs an explicit decision per repo.

**Adding sections (`/service`) vs. adding repos.**
Chosen: express new sections as routes inside this repository (`app/service/page.tsx` → `<prefix>/service`). One pipeline, one deploy, no new Pages setup. The collision rule to enforce: a route name must never equal the name of another repository serving a project site under the same account, or two sites will contend for the same URL path. Guard with a CI check comparing route names against the account's Pages-enabled repo names.

**Repository independence.**
Each repo gets its own workflow with `pages: write`, `actions/deploy-pages`, and its own `github-pages` environment. No cross-repo dependency; a failure in one must not block the other.

**Styling: CSS Modules + design tokens over a UI kit.**
Chosen: CSS Modules with CSS custom properties for tokens (color, spacing, type scale), plus system font stack. No Tailwind or component library: the site is small, and zero-runtime styling keeps the JS/CSS budget comfortable. Rejected a heavy UI kit to avoid shipping unused components.

**Accessibility as a build-time gate.**
Add automated checks (eslint jsx-a11y, Lighthouse CI against the performance budget and accessibility thresholds) in the same workflow as the build, so violations fail before publishing.

**CI/CD: GitHub Actions with the official Pages workflow.**
Build on pull requests (verify only) and on merge to the default branch run build → lint → a11y/performance budget → upload artifact → deploy. Deployment uses `actions/deploy-pages` with the Pages artifact, which gives atomic publish semantics: a failed build leaves the live site untouched. Alternative (push to `gh-pages` branch) was rejected as it loses atomicity and history hygiene.

**Unknown-slug handling.**
Static export cannot do runtime 404s; use the framework's `not-found` page plus CI-time link checking so broken project URLs are caught before publish.

**Analytics: none by default.**
No third-party scripts; an analytics hook point stays behind a config flag that is off, keeping the privacy requirement enforceable.

**Booking integration: Cal.com inline embed with a plain-link fallback.**
Chosen: render Cal.com's official inline embed widget pointed at the public account `https://cal.com/dibasbehera` inside a lazily-mounted client component, and always render a visible plain link to the same URL next to it. The embed gives in-page booking; the fallback guarantees the path survives JS failure, ad blockers, and Cal.com outages. Embed choice is driven by a single config value (`booking: { provider: 'cal', handle: 'dibasbehera', eventTypeSlug?, embed: boolean }`), so swapping to a plain link only, or to Calendly/Formspree later, is a configuration change. Alternative considered: link-out only (simplest, zero third-party script, but a full navigation away and worse conversion); rejected because the account and pricing already exist and the embed is the point of the feature.

**Payment: delegated entirely to Cal.com.** Pricing is displayed as text on the site and payment is completed on Cal.com. This site stores no booking or payment state, which is what keeps it viable on static hosting.

**Third-party script and privacy control.** The embed loads scripts from Cal.com's documented asset hosts, so the site must allow those origins in its Content-Security-Policy. The embed is mounted on interaction (or on idle) rather than at page load, to protect the performance budget and avoid third-party cookies before consent. No analytics or ads are loaded; the privacy spec permits the booking provider origin as the only third-party origin.

**Where booking lives.** A dedicated `/book` page rather than an inline home-page widget, so the embed and its scripts never affect the landing page's performance budget or its no-tracking baseline. The contact section links to it, and `/book` carries the pricing and the plain-link fallback.

## Risks / Trade-offs

- [Cal.com embed is a third-party dependency that can break or be blocked] → always-visible plain link to `https://cal.com/dibasbehera` as the guaranteed path.
- [Third-party scripts can regress the JS/CSS performance budget] → booking lives on a separate route mounted lazily, so the home-page budget stays comfortably inside its limit; budget check runs against the built output.
- [Embed sets provider cookies before any consent exists] → mount on user interaction only; no site-owned visitor tracking; CSP limited to the provider's documented hosts.
- [If the Cal.com handle or event slug changes, hardcoded URLs go stale] → single `booking` config value read by both the link and the embed, with a test asserting they agree.
- [Price/currency can drift from the Cal.com configuration] → treat the site's price text as a mirror; verify against the live booking page during the integration check, and note in docs that Cal.com is the source of truth.
- [JS payload from a React/Next runtime] → Enforce the 500 KB JS+CSS budget in CI; keep client components to interactive islands only.
- [Subpath breakage if `basePath` is wrong in one environment] → derive it from a single build-time value; CI link-checks the built output; smoke-test the deployed URL after publish.
- [Public URL carries `/dibasbehera`] → deliberate and reversible; the base path is a build value, not code.
- [Apex URL cannot be published on the current plan] → the apex repo is private; nothing is live there today, so project-site hosting loses nothing.
- [A future route name colliding with another repo's project site] → CI check comparing route names against the account's Pages-enabled repository names.
- [Per-project static pages grow the build] → negligible at portfolio scale; revisit only if project count becomes large.

## Migration Plan

1. Scaffold the Next.js app with static export and base-path config.
2. **Run a hosting smoke test before any content work**: stub page plus a `/service` stub, minimal `deploy-pages` workflow with `NEXT_PUBLIC_BASE_PATH=/dibasbehera`, push, then confirm `https://dibasbehera7.github.io/dibasbehera` and `https://dibasbehera7.github.io/dibasbehera/service` both return 200 and that no link or asset escapes the prefix. This settles the hosting question while there is almost nothing to rebuild if it fails.
3. Add content data, sections, and project detail routes.
4. Add the booking page, Cal.com embed, and the CSP allowance for the provider's hosts.
5. Add the quality gates (lint, a11y, budget, link, route-collision) and make them gate the publish step.
6. Merge to the default branch; verify the deployed URL and that booking completes on Cal.com. Rollback = revert the merge commit, which triggers a redeploy of the previous build.

## Open Questions

- The Cal.com **event type slug** for the 1:1 session (the account URL alone may render a list). Can be set in config without touching code or specs.
- Session duration and exact price/currency text — mirror values to confirm against the live Cal.com page.
- Whether the embed should mount on interaction or on idle once real usage data exists.
- Whether analytics will ever be enabled (and with which provider) - deferrable, config flag already isolates it.
- Whether and when an apex or custom-domain site is created - out of scope here; the base path already makes it a value change plus a repo decision.
- Whether a custom domain will be attached later, and whether the portfolio should move onto it - requires a per-repo CNAME decision, not a code change.
- Exact project count and whether any project needs rich embedded media - affects only asset size, not structure.