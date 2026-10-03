# Tasks

## 1. Project scaffold and static export setup

- [x] 1.1 Initialize the Next.js app with TypeScript in the repo root and verify `npm run dev` serves the default page
- [x] 1.2 Configure `output: 'export'` plus `basePath`/`assetPrefix` read from a single `NEXT_PUBLIC_BASE_PATH` build value, and verify `npm run build` emits an `out/` directory whose asset URLs are correct for both `""` and `/dibasbehera` (design decision: base path handling)
- [x] 1.3 Add ESLint with `jsx-a11y` rules and verify `npm run lint` fails on a deliberately inaccessible element
- [x] 1.4 Add a baseline Content-Security-Policy header for static hosting and verify no CSP violation appears in the console on the local build

## 2. GitHub Pages hosting smoke test (validate hosting before building content)

- [x] 2.1 Add a temporary stub page at `/` plus a stub `/service` route and verify both are emitted into `out/` by `npm run build` (spec: route layout extensible within the site)
- [x] 2.2 Add a minimal deploy workflow using `actions/deploy-pages` with `pages: write` permission and `NEXT_PUBLIC_BASE_PATH=/dibasbehera` set as a build variable
- [x] 2.3 Push to the default branch and verify the workflow completes and Pages is enabled for the repository (source: GitHub Actions)
- [x] 2.4 Verify `https://dibasbehera7.github.io/dibasbehera` returns HTTP 200 and renders the stub content
- [x] 2.5 Verify the sub-path routing assumption by checking `https://dibasbehera7.github.io/dibasbehera/service` returns 200 (confirms `/service` can be added later as a route)
- [x] 2.6 Verify no internal link or asset resolves outside the `/dibasbehera` prefix and no asset 404s in the browser network panel
- [x] 2.7 Confirm the hosting decision is settled; record the deployed URL in `README.md` and remove the stub pages, keeping the deploy workflow

## 3. Content model and home page sections

- [x] 3.1 Define the `Project`, `ExperienceEntry`, `Skill`, and `SiteConfig` types and verify `tsc --noEmit` rejects a project missing `slug` or `status`
- [x] 3.2 Create the content data modules with seed data covering one completed and one in-progress project, and verify unit tests assert both statuses are present
- [x] 3.3 Implement hero/introduction section and verify a snapshot test shows the summary text
- [x] 3.4 Implement project showcase cards including tag list, links, and status badge, and verify tests cover a project with no demo link (renders no demo anchor) and the in-progress state exposing a text label
- [x] 3.5 Implement skills overview section and verify a test asserts all configured skills render
- [x] 3.6 Implement experience timeline section and verify entries render in configured order
- [x] 3.7 Implement contact section with email and profile links, and verify a test asserts the `mailto:` href
- [x] 3.8 Assemble the home page with semantic landmarks in the required order and verify a DOM test asserts the section order (spec: portfolio content sections)
- [x] 3.9 Link the contact section to the booking page and verify a test asserts the link target (spec: session booking entry point)

## 4. Project detail pages

- [x] 4.1 Implement the project detail route with `generateStaticParams` from slugs and verify `out/projects/<slug>/index.html` exists for every seed project
- [x] 4.2 Render project description, tags, status, and outbound links on the detail page and verify a test asserts each field appears
- [x] 4.3 Implement the not-found page with a link home and verify a request for an unknown slug renders it (spec: project detail pages)

## 5. Session booking (Cal.com)

- [x] 5.1 Add a `booking` config value (`provider: 'cal'`, `handle: 'dibasbehera'`, `eventTypeSlug`, `price`, `currency`, `duration`) and verify a unit test asserts the derived booking URL equals `https://cal.com/dibasbehera`
- [x] 5.2 Implement the `/book` page with session name, duration, price/currency text, and an always-visible plain link to `https://cal.com/dibasbehera`, and verify DOM tests assert each element is present (spec: session booking entry point, paid session pricing)
- [x] 5.3 Mount the Cal.com inline embed in a client component on the `/book` page only, and verify the home page build output contains no Cal.com script or asset reference
- [x] 5.4 Verify the fallback path by simulating embed failure (script blocked in a test/browser) and confirming the plain booking link still reaches the Cal.com page
- [x] 5.5 Verify the embed and the plain link derive from the same config value and cannot drift, via a test asserting both hrefs are identical
- [ ] 5.6 Add the Cal.com asset origins to the Content-Security-Policy and verify the deployed site loads the embed with no CSP violation in the console
- [x] 5.7 Style the booking page responsively and accessibly, and verify a keyboard-only test reaches the booking control with a visible focus indicator
- [ ] 5.8 Manually complete an end-to-end test booking on the live `https://cal.com/dibasbehera` page, including a paid session, and confirm no booking or payment data is handled by this site

## 6. Styling, responsiveness, and accessibility

- [x] 6.1 Define CSS custom properties for color, spacing, and type tokens and verify components consume tokens rather than hardcoded colors
- [x] 6.2 Style all sections with CSS Modules and verify no global style leakage between sections
- [ ] 6.3 Add responsive breakpoints down to 320px and verify no horizontal overflow at 320/768/1280 widths on every page including `/book` and `/service`
- [x] 6.4 Add visible focus styles and verify a keyboard-only navigation test reaches every interactive element in order
- [x] 6.5 Ensure images have descriptive alt text and decorative images are marked as such, and verify the a11y lint rule set passes

## 7. Performance budget and CI quality gates

- [x] 7.1 Add a bundle-size budget check (500 KB JS+CSS combined) against the home-page bundle and verify the check passes on the current build and fails on an artificially inflated bundle (spec: performance budget)
- [x] 7.2 Add Lighthouse CI asserting mobile performance >= 90 and accessibility pass, and verify the job fails when the threshold is lowered deliberately
- [x] 7.3 Add CI link checking and verify an intentionally broken internal project link fails the check
- [x] 7.4 Add a CI check comparing route names against the account's Pages-enabled repository names and verify it flags a deliberately colliding route name (spec: route layout extensible within the site)
- [x] 7.5 Extend the deploy workflow so build, lint, budget, a11y, and link checks all gate the publish step, and verify a failing check leaves the live site unchanged

## 7b. Visual theme redesign and curated content

- [x] 7b.1 Replace the colour palette with a purple banking-inspired set (deep-purple utility bar, purple nav bar, lavender page background, white cards) and verify a token test asserts each colour
- [x] 7b.2 Add dedicated `--color-bar`, `--color-bar-deep`, `--color-on-bar`, and `--color-link` tokens so header and link text meet 4.5:1 in BOTH colour schemes, and verify via Lighthouse accessibility 100 in dark-mode emulation
- [x] 7b.3 Add a two-tier `TopBar` component (utility bar with role/tagline and email, nav bar with brand mark and section links) and verify it renders with a labelled primary navigation
- [x] 7b.4 Add decorative curved background shapes marked `aria-hidden`, and verify they are present but hidden from assistive technology
- [x] 7b.5 Convert the project showcase to a horizontally scrollable rail with scroll snapping and fixed card width, and verify a test asserts `overflow-x: auto`, `scroll-snap-type`, and focusability
- [x] 7b.6 Add a `featured` flag to the project model and expose `featuredProjects`, and verify the home page lists only featured projects while unfeatured detail pages still resolve
- [x] 7b.7 Add an `InterviewPreps` section with a matching scrollable rail, and verify titles, topics, and per-card links render
- [x] 7b.8 Update the owner's contact email to the real address and verify the `mailto:` link and the header utility link both use it
- [x] 7b.9 Re-run Lighthouse and confirm performance >= 90 and accessibility 100 on the home page and the booking page

## 7c. Header, contact, footer, rails, and expanded content

- [x] 7c.1 Update the spec delta for the removed email, sticky single-tier header, footer, hidden scrollbar with arrow controls, minimum entry counts, and cross-section dedup, and verify `openspec validate --strict` passes
- [ ] 7c.2 Remove the utility bar from `TopBar` and verify no tagline or email strip renders above the navigation
- [ ] 7c.3 Make the navigation bar sticky and verify a test asserts `position: sticky` with `top: 0`
- [ ] 7c.4 Remove the email from the contact section and verify no `mailto:` exists on any page
- [ ] 7c.5 Add a `Footer` with a heart, an Indian flag, and a "Powered by GitHub" link to the owner's profile, and verify a test asserts all three
- [ ] 7c.6 Add a `ScrollRail` client component that hides the native scrollbar and exposes labelled previous/next arrow buttons, and verify a test asserts the arrows scroll the rail and that CSS hides the scrollbar while keeping `overflow-x: auto`
- [ ] 7c.7 Rewire the project showcase and interview preparation sections onto `ScrollRail`, and verify both rails render arrow controls
- [ ] 7c.8 Expand the curated projects to at least ten entries and the interview preps to at least ten entries using repositories verified to return HTTP 200, and verify tests assert both minimum counts
- [ ] 7c.9 Remove every "Read online" style secondary link and verify no such label remains in the content
- [ ] 7c.10 Assert that the projects and preps repository sets are disjoint, and verify the check fails when an overlap is introduced
- [ ] 7c.11 Present repository links as buttons, and verify a test asserts the button styling and activatable link
- [ ] 7c.12 Add a network-gated test asserting every configured external repository URL returns HTTP 200, and verify it skips cleanly when offline
- [x] 7c.13 Re-run the full gate: typecheck, lint, tests, build, site checks, collision check, and Lighthouse performance >= 90 with accessibility 100 on `/` and `/book/`

## 7d. Contact layout, clickable cards, and detail modals

- [x] 7d.1 Update the spec delta for the contact layout, removal of the profile link list from the contact section, and clickable cards that reveal details in a dialog, and verify `openspec validate --strict` passes
- [x] 7d.2 Remove the GitHub profile link list from the contact section, leaving the booking entry point as the single contact action, and verify a test asserts no profile links remain in that section
- [x] 7d.3 Right-align the "Book a 1:1 session" control alongside the Contact heading, and verify the heading and control share one row at desktop width and stack on narrow viewports
- [x] 7d.4 Make each project card activatable as a whole, opening an in-page dialog that shows the title, status, tags, summary, detail body, and repository button, and verify a test asserts the dialog opens and exposes an accessible name and a close control
- [x] 7d.5 Make each interview preparation card activatable as a whole, opening an in-page dialog with its title, topics, and repository button, and verify the same
- [x] 7d.6 Keep the project detail pages reachable by URL alongside the dialog, and verify both the dialog and the existing detail route expose the same content
- [x] 7d.7 Confirm the dialog is closable by keyboard (Escape and the close control) and returns focus to the activating card
- [x] 7d.8 Re-run the full gate, including Lighthouse; if the added interactivity pushes home-page performance below 90, report it rather than lowering the threshold

## 8. Integration verification and documentation

- [ ] 8.1 Walk every spec scenario against the deployed site, including a live booking, and record pass/fail, fixing any gaps found
- [ ] 8.2 Write `README.md` covering local development, content editing (adding a project), base-path configuration, the deployed URL, and the deploy/rollback procedure
- [ ] 8.3 Write `docs/booking.md` covering the Cal.com account `https://cal.com/dibasbehera`, how to change the event slug/price in config, that Cal.com is the source of truth, and the CSP host allowance
- [ ] 8.4 Record privacy posture in `docs/booking.md`: which Cal.com hosts are contacted, what the provider's cookie behaviour implies, and that no analytics or ads are loaded
- [ ] 8.5 Record hosting notes in `README.md`: this site is the project site for the `dibasbehera` repo, the apex `dibasbehera7.github.io` is a separate site, and moving to the apex or a custom domain is a build-value plus repo decision rather than a code change