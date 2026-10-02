# Spec Delta

## Purpose

Defines how a personal portfolio website presents projects, skills, experience, and contact information to visitors, and how that site is published as a static build on GitHub Pages.

## ADDED Requirements

### Requirement: Portfolio content sections
The site SHALL render the following sections, each populated from project-owned content files rather than hardcoded page markup: an introduction/hero summary, a project showcase, a skills overview, a work-experience timeline, and a contact section.

#### Scenario: Visitor loads the home page
- **WHEN** a visitor requests the site root
- **THEN** the response contains the introduction, project showcase, skills overview, experience timeline, and contact sections in a single page

#### Scenario: Content file is edited
- **WHEN** the owner changes a project's title, description, status, tags, or links in the content source and the site is rebuilt
- **THEN** the rebuilt site renders the updated values without any change to page components

### Requirement: Project showcase with lifecycle status
The site SHALL present each showcased project with a title, short description, technology tags, links (repository and/or live demo), and a status that distinguishes completed work from work currently in progress.

#### Scenario: Ongoing project is displayed
- **WHEN** a project is marked as in progress
- **THEN** its card is visibly distinguished from completed projects and its in-progress state is exposed to assistive technology as text, not colour alone

#### Scenario: Project has no live demo
- **WHEN** a project defines only a repository link
- **THEN** the card renders the repository link and omits the demo link rather than rendering a dead link

### Requirement: Project detail pages
The site SHALL provide a dedicated detail page for each showcased project reachable by a stable URL derived from the project's slug.

#### Scenario: Visitor opens a project detail page
- **WHEN** a visitor navigates to a project detail URL
- **THEN** the page shows the project description, technology tags, status, and outbound links, and the URL can be shared and reloaded directly

#### Scenario: Unknown project slug is requested
- **WHEN** a project detail URL references a slug that does not exist
- **THEN** the site returns a not-found page that still provides navigation back to the home page

### Requirement: Responsive and accessible presentation
The site SHALL be usable at viewport widths from 320px upward without horizontal scrolling, and SHALL meet WCAG 2.1 AA for keyboard navigation, visible focus, colour contrast, semantic landmarks, and image alternative text.

#### Scenario: Site is viewed on a small screen
- **WHEN** the home page is loaded at a 320px viewport width
- **THEN** all sections remain readable and no content requires horizontal scrolling

#### Scenario: Visitor navigates by keyboard only
- **WHEN** a visitor navigates the home page using only the keyboard
- **THEN** every interactive element receives focus in a logical order with a visible focus indicator

### Requirement: Contact reachability
The site SHALL provide at least one direct contact method (email link and/or links to professional profiles) in the contact section.

#### Scenario: Visitor activates the email link
- **WHEN** a visitor activates the email contact link
- **THEN** the user's default mail client opens with the recipient address pre-filled

### Requirement: Static hosting on GitHub Pages
The site SHALL be produced as a fully static build containing no server-side runtime dependency, and SHALL be published to GitHub Pages automatically from the repository's default branch.

#### Scenario: Change is merged to the default branch
- **WHEN** a commit is merged into the default branch
- **THEN** a CI workflow builds the site and publishes the output to GitHub Pages without manual steps

#### Scenario: Build fails
- **WHEN** the build or verification step fails
- **THEN** the workflow exits with a non-zero status and the currently published site remains unchanged

#### Scenario: Visitor requests the live site
- **WHEN** a visitor requests the published GitHub Pages URL over HTTPS
- **THEN** the site is served over HTTPS and all asset references resolve without 404s

### Requirement: Hosting location configurable at build time
The site SHALL derive its public URL prefix from a single build-time configuration value, so the same codebase can be published at a GitHub Pages account root URL (`dibasbehera7.github.io`) or at a project sub-path (`dibasbehera7.github.io/dibasbehera`) without code changes. No internal URL SHALL be hardcoded to a specific host or path prefix.

#### Scenario: Built for a sub-path
- **WHEN** the site is built with a path prefix of `/dibasbehera`
- **THEN** every internal link, route URL, and asset reference is prefixed accordingly and the site functions correctly when served from `dibasbehera7.github.io/dibasbehera`

#### Scenario: Built for the account root
- **WHEN** the site is built with an empty path prefix
- **THEN** the site functions correctly when served from `dibasbehera7.github.io` with no code change beyond the build-time value

#### Scenario: Prefix is changed
- **WHEN** the path prefix value is changed and the site is rebuilt
- **THEN** no source change is required and no internal link resolves outside the configured prefix

### Requirement: Route layout extensible within the site
The site SHALL support additional top-level sections (for example a `/service` offering page) added as routes within the same project, and the owner SHALL be able to add such routes without altering existing section behaviour.

#### Scenario: New route is added
- **WHEN** a `/service` route is added to the site
- **THEN** it is reachable at `<path-prefix>/service`, existing routes and their URLs are unchanged, and shared navigation continues to work

#### Scenario: Route name would collide with a hosted project site
- **WHEN** a route name is introduced that matches the name of a separate GitHub repository serving a project site under the same account
- **THEN** the conflict is detected before publishing and the route is renamed or the other repository is renamed, so exactly one site owns that URL path

### Requirement: Independent publication per repository
Each repository that publishes to GitHub Pages SHALL be independently buildable and independently publishable, with no coupling to another repository's pipeline or release.

#### Scenario: Portfolio repository is deployed alone
- **WHEN** the portfolio repository's default branch receives a commit
- **THEN** only that repository's site is rebuilt and published, and no other repository's pipeline is triggered or blocked

### Requirement: Performance budget
The initial page load SHALL transfer no more than 500 KB of JavaScript and CSS combined, and the site SHALL achieve a Lighthouse performance score of 90 or above on mobile emulation.

#### Scenario: Production build is measured
- **WHEN** the built site is measured against the performance budget in CI
- **THEN** the workflow fails if the JavaScript and CSS budget or the Lighthouse threshold is exceeded

### Requirement: Analytics-free and privacy-conscious third-party loading
The site SHALL load no advertising, tracking, or analytics scripts, and the only permitted third-party script origin SHALL be the booking provider's origin.

#### Scenario: Default deployment
- **WHEN** the site is deployed without an explicit analytics integration
- **THEN** no third-party analytics or advertising script is requested by the page

#### Scenario: Booking surface loads third-party assets
- **WHEN** the booking surface initializes
- **THEN** third-party requests are limited to the booking provider's documented asset hosts, and the site sets no visitor-identifying cookies of its own for that flow

#### Scenario: Analytics is added later
- **WHEN** an analytics integration is enabled
- **THEN** it is behind a consent gate that defaults to not loading, and the consent mechanism is documented

### Requirement: Session booking entry point
The site SHALL present a session booking section that offers a visitor a clear, always-available path to book a 1:1 session with the site owner through the public Cal.com account `https://cal.com/dibasbehera`.

#### Scenario: Visitor opens the booking section
- **WHEN** a visitor reaches the booking section
- **THEN** the section names the 1:1 session, states the session duration, and provides a booking control that opens the owner's Cal.com booking page at `https://cal.com/dibasbehera`

#### Scenario: Visitor activates the booking control
- **WHEN** a visitor activates the booking control
- **THEN** the Cal.com booking flow for `https://cal.com/dibasbehera` opens and the visitor can select an available slot and complete the booking, including paying where the session is a paid session

#### Scenario: Cal.com cannot be loaded
- **WHEN** the booking surface fails to load, or the visitor has JavaScript disabled, or the Cal.com embed is blocked
- **THEN** a visible plain link to `https://cal.com/dibasbehera` remains available so the visitor can still reach the booking page

#### Scenario: Visitor leaves the site to book
- **WHEN** booking occurs on Cal.com
- **THEN** the site stores no booking details, payment data, or visitor identity, and imposes no cookie or analytics of its own on the visitor for the booking flow

### Requirement: Paid session pricing
The site SHALL display the price and currency of a paid 1:1 session before the visitor is sent to booking, and SHALL NOT collect payment details itself.

#### Scenario: Visitor views pricing
- **WHEN** the booking section is visible
- **THEN** the session price and currency are shown as text before any handoff to Cal.com

#### Scenario: Visitor proceeds to pay
- **WHEN** the visitor selects a paid session slot
- **THEN** payment is completed on Cal.com and the site is never the party handling payment data

## Deferred Alternatives

Form-based email contact (e.g. Formspree, EmailJS) and alternative scheduling providers (e.g. Calendly) remain viable fallbacks. They are not selected here because a Cal.com account already exists with pricing enabled; switching later is a configuration change at the integration point rather than a redesign.