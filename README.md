# Portfolio

Personal portfolio site for Dibas Behera — projects, interview preparation
material, experience, and 1:1 session booking.

**Live:** https://dibasbehera7.github.io/dibasbehera

Static site built with Next.js and exported to plain HTML, published to GitHub
Pages by a GitHub Actions workflow on every merge to `main`.

## Stack

- Next.js (App Router) with `output: 'export'` — no server runtime
- React and TypeScript
- CSS Modules plus a plain `rail.css` for styles shared across components
- Cal.com inline embed for session booking
- Vitest and Testing Library
- Lighthouse, via `@lhci`-free direct scripting in `scripts/`

## Local development

```bash
npm ci
npm run dev          # http://localhost:3000
```

The site is served from the root locally, so `NEXT_PUBLIC_BASE_PATH` is unset.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static export into `out/` |
| `npm test` | Unit and component tests |
| `npm run test:watch` | Tests in watch mode |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint, including `jsx-a11y` rules as errors |
| `npm run verify:site` | Bundle budget, internal links, booking isolation |
| `npm run check:collisions` | Route names vs published repository names |
| `npm run check:browser` | 320px reflow and CSP console checks |
| `npm run lighthouse` | Performance and accessibility thresholds |
| `npm run check:live` | Scenario checks against `SITE_URL` |

## Content

Content is typed data, not markup. Editing these files is all that is needed to
change what the site shows:

| File | Contents |
| --- | --- |
| `app/content/site.ts` | Name, role, tagline, introduction, professional profiles, booking settings |
| `app/content/projects.ts` | Projects. Set `featured: true` to show one on the home page |
| `app/content/preps.ts` | Interview preparation entries |
| `app/content/skills.ts` | Skill groups |
| `app/content/experience.ts` | Work experience timeline |

Notes for editors:

- The home page shows **only** projects marked `featured`. Unfeatured projects are
  still built and reachable at `/projects/<slug>`.
- Projects and interview preparation entries must not share a repository. A test
  enforces this, and `npm run check:live` verifies the result.
- Every external repository URL is checked. `npm test` skips that check unless
  `CHECK_EXTERNAL_LINKS=1` is set; CI runs both.

## Base path and hosting

The site is served from a sub-path, so the prefix is a **build-time** value:

```bash
NEXT_PUBLIC_BASE_PATH=/dibasbehera npm run build   # project site
NEXT_PUBLIC_BASE_PATH= npm run build               # account root site
```

Never hardcode the prefix in a link. Use `next/link`, which applies it
automatically; a raw `<a href="/projects/...">` does not and will 404 in
production.

GitHub Pages gives each repository its own site at
`<login>.github.io/<repo-name>/`, so many sites can coexist under one account.
Only the apex `<login>.github.io` is exclusive, and it requires a repository named
exactly `<login>.github.io`.

This site is the project site for the `dibasbehera` repository. The
`dibasbehera7` repository is a separate site and is not touched by this pipeline.

To move this site to the apex, or to a custom domain:

1. Create or take over a repository named `dibasbehera7.github.io` (public —
   Pages is unavailable on private repositories on the free plan).
2. Build with an empty `NEXT_PUBLIC_BASE_PATH`.
3. Point the deploy workflow at that repository.

Each repository needs its own workflow, its own `pages: write` permission, and its
own `github-pages` environment. Attaching a custom domain to the apex site does
not by itself move project sites onto that domain, so treat it as a separate,
explicit decision.

## Deployment

`main` → build → verify → publish. Publishing happens only after every check
passes, and a failed check leaves the live site untouched.

| Step | What it enforces |
| --- | --- |
| `typecheck` | No TypeScript errors |
| `lint` | No lint errors, `jsx-a11y` enforced |
| `build` | Static export succeeds |
| `test` | Unit and component tests |
| External links | Every configured repository URL returns 200 |
| `verify:site` | 500 KB JS+CSS transfer budget, internal links resolve, Cal.com only on `/book` |
| `check:collisions` | No route name collides with a published repository |
| `check:browser` | No horizontal overflow at 320px, no CSP violations |
| `lighthouse` | Performance ≥ 90, accessibility 100, best practices ≥ 90, SEO ≥ 90 |
| `check:live` | Published pages match the specification |

**Rollback:** revert the commit on `main`. The workflow redeploys the previous
build.

## Accessibility

Targets WCAG 2.1 AA: semantic landmarks, keyboard operability including the card
rails and dialogs, visible focus, colour contrast checked in both colour schemes,
alt text, and a 24px minimum touch target.

Colour scheme follows the visitor's system preference. Header bars and links use
dedicated tokens so contrast holds in both schemes.

## Known limitations

- Client-side route prefetch requests (`__next.*.txt`) return 404 under a base
  path in the current Next.js version. Navigation falls back to a full page load;
  there is no user-visible breakage.
- The booking calendar requires JavaScript. A plain link to the Cal.com account
  is always visible as a fallback, and works with scripting disabled.

## Booking

See [`docs/booking.md`](docs/booking.md) for configuration, payment handling, and
the privacy posture.