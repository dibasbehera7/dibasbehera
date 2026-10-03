# portfolio-website Specification

## Purpose

Defines how a personal portfolio website presents projects, skills, experience, and contact information to visitors, and how that site is published as a static build on GitHub Pages.

## Requirements


### Requirement: Portfolio content sections
The site SHALL render the following sections, each populated from project-owned content files rather than hardcoded page markup: an introduction/hero summary, a curated project showcase, an interview preparation section, a skills overview, a work-experience timeline, a contact section, and a site footer. A single-tier sticky site header providing navigation to those sections SHALL be present.

#### Scenario: Visitor loads the home page
- **WHEN** a visitor requests the site root
- **THEN** the response contains the introduction, project showcase, skills overview, experience timeline, and contact sections in a single page

#### Scenario: Content file is edited
- **WHEN** the owner changes a project's title, description, status, tags, or links in the content source and the site is rebuilt
- **THEN** the rebuilt site renders the updated values without any change to page components

### Requirement: Horizontally scrollable card rails
The project showcase and the interview preparation section SHALL each present their cards as a horizontally scrollable rail with scroll snapping. The rail SHALL NOT display a visible native scrollbar, SHALL provide previous and next arrow controls, and SHALL remain operable by keyboard.

#### Scenario: Visitor scrolls the project rail
- **WHEN** the rail's content is wider than the viewport
- **THEN** the rail scrolls horizontally with snap points per card, and the page itself does not scroll horizontally

#### Scenario: Visitor activates a rail arrow
- **WHEN** a visitor activates the next or previous arrow control on a rail
- **THEN** the rail advances or retreats by one card

#### Scenario: No scrollbar track is shown
- **WHEN** a rail is rendered
- **THEN** the native scrollbar is not visible, while horizontal scrolling behaviour and snap points are retained

#### Scenario: Keyboard-only visitor uses the rail
- **WHEN** a visitor tabs to the rail or its arrow controls
- **THEN** each receives focus as a labelled control so a keyboard user can scroll the rail

### Requirement: Curated project showcase
The home page SHALL list only an explicitly curated selection of at least ten projects, identified by a `featured` marker in the content source. Projects without that marker SHALL remain reachable by their detail URL but SHALL NOT appear on the home page. Every project entry SHALL expose its repository as a button-styled link, and no "read online" style secondary link SHALL be shown.

#### Scenario: Owner curates the selection
- **WHEN** a project is marked as featured
- **THEN** it appears on the home page in project order

#### Scenario: A project is not curated
- **WHEN** a project has no featured marker
- **THEN** it is absent from the home page while its detail page remains reachable by URL

#### Scenario: Minimum selection size
- **WHEN** the home page renders the project showcase
- **THEN** at least ten projects are listed

#### Scenario: Repository is presented as a button
- **WHEN** a project card renders its repository link
- **THEN** the link is presented as a button and is activatable by keyboard and pointer

### Requirement: Interview preparation section
The site SHALL present an interview preparation section listing at least ten preparation entries, each naming its topic area, the topics it covers, and a repository link presented as a button.

#### Scenario: Visitor opens the interview preparation section
- **WHEN** a visitor reaches the section
- **THEN** each entry shows its title, its covered topics, and its outbound material links

#### Scenario: Minimum entry count
- **WHEN** the section renders
- **THEN** at least ten entries are listed

### Requirement: No duplicated material between sections
No single repository SHALL be presented in both the project showcase and the interview preparation section.

#### Scenario: Owner configures both sections
- **WHEN** the project showcase and the interview preparation section are both populated
- **THEN** their repository links do not overlap

#### Scenario: Overlap is introduced
- **WHEN** the same repository is configured in both sections
- **THEN** a check reports the duplication as an error

### Requirement: Visual theme
The site SHALL present a purple banking-inspired visual language: a purple navigation bar, white cards on a light lavender page background, pill-shaped chips and buttons, and soft curved background shapes. No third-party logo, wordmark, or trademark SHALL be reproduced; the owner's own name serves as the header brand mark.

#### Scenario: Header renders in both colour schemes
- **WHEN** the site is viewed in either the light or the dark colour scheme
- **THEN** header bar text, navigation text, and links each meet a 4.5:1 contrast ratio against their own background

#### Scenario: Curved background shapes render
- **WHEN** the home page loads
- **THEN** soft curved background shapes are present and hidden from assistive technology, because they are decorative

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
The site SHALL present the booking entry point as the only content of the contact section: a heading and the booking control, with no explanatory body copy, no email address, and no list of social profile links. The booking control SHALL sit on the same row as the Contact heading, right-aligned at desktop widths, and SHALL stack below the heading at narrow widths. The site SHALL NOT display an email address anywhere on any page.

#### Scenario: Visitor reaches the contact section
- **WHEN** a visitor reaches the contact section
- **THEN** the heading and booking control are shown, with no body copy, no social profile link list, and no email address

#### Scenario: Desktop and narrow layouts
- **WHEN** the contact section is viewed at desktop width and then at a narrow viewport
- **THEN** the booking control is right-aligned beside the Contact heading at desktop width and stacked below it at narrow width

#### Scenario: Visitor looks for an email address
- **WHEN** any page of the site is inspected
- **THEN** no email address and no `mailto:` link is present

### Requirement: Clickable cards reveal details in a dialog
Each project card and each interview preparation card SHALL be activatable as a whole, opening an in-page dialog that presents that entry's details without navigating away. The dialog SHALL offer the entry's outbound repository button and SHALL NOT offer a link to a separate full page. Project detail pages SHALL remain reachable by their stable URL.

#### Scenario: Visitor activates a project card
- **WHEN** a visitor activates a project card
- **THEN** a dialog opens in place, presenting the project's title, status, tags, summary, detail body, and repository button, without a page navigation

#### Scenario: Dialog contents are limited to the entry
- **WHEN** a dialog is open
- **THEN** no link to a full project page or any other secondary destination is offered inside it

#### Scenario: Visitor activates an interview preparation card
- **WHEN** a visitor activates an interview preparation card
- **THEN** a dialog opens in place presenting its title, covered topics, and repository button

#### Scenario: Visitor closes a dialog
- **WHEN** a visitor activates the dialog's close control or presses Escape
- **THEN** the dialog closes and focus returns to the card that opened it

#### Scenario: Detail page is still reachable
- **WHEN** a project's detail URL is requested directly or shared
- **THEN** the same content is served at that URL, independently of the dialog

### Requirement: About section layout
The introduction section SHALL present its content as a centred column occupying the middle of the page rather than stretched across the full width, and SHALL reflow to the viewport width on narrow screens.

#### Scenario: Desktop layout
- **WHEN** the home page is viewed at desktop width
- **THEN** the introduction content sits in a centred column with balanced margins and does not span the full page width

#### Scenario: Narrow layout
- **WHEN** the home page is viewed at a narrow viewport
- **THEN** the introduction content fits the viewport with no horizontal scrolling

### Requirement: Site header
The site SHALL render a single-tier header containing a brand mark and primary navigation to the home page, the project showcase, the interview preparation section, and the booking page. The header SHALL remain visible while the rest of the page scrolls.

#### Scenario: Visitor scrolls the page
- **WHEN** a visitor scrolls down the home page
- **THEN** the header stays fixed at the top of the viewport and the remaining content scrolls beneath it

#### Scenario: No utility bar is present
- **WHEN** any page is inspected
- **THEN** no secondary utility strip of contact details or taglines is rendered above the primary navigation

### Requirement: Site footer
The site SHALL render a footer containing a heart symbol, an Indian flag symbol, and an attribution to GitHub that links to the owner's GitHub profile.

#### Scenario: Visitor scrolls to the footer
- **WHEN** a visitor reaches the end of the page
- **THEN** the footer shows a heart, an Indian flag, and a "Powered by GitHub" attribution linking to the owner's GitHub profile

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
The site SHALL present a session booking section that offers a visitor a single clear path to book a 1:1 session with the site owner through the public Cal.com account `https://cal.com/dibasbehera`. Activating the booking control SHALL render the Cal.com booking calendar in place on the page. The section SHALL consist only of the session name, the price, and that control: no separate duration line, no direct-link fallback, and no explanatory body copy.

#### Scenario: Visitor opens the booking section
- **WHEN** a visitor reaches the booking section
- **THEN** the session name, its price, and a booking control are shown, and nothing else

#### Scenario: Visitor activates the booking control
- **WHEN** a visitor activates the booking control
- **THEN** the Cal.com booking calendar for `https://cal.com/dibasbehera` renders in place on the page, and the visitor can select an available slot and complete the booking, including paying where the session is a paid session

#### Scenario: Visitor leaves the site to book
- **WHEN** booking occurs on Cal.com
- **THEN** the site stores no booking details, payment data, or visitor identity, and imposes no cookie or analytics of its own for the booking flow other than the embedded calendar itself

### Requirement: Paid session pricing
The site SHALL display the price and currency of a paid 1:1 session, together with its duration, before the visitor is sent to booking, and SHALL NOT collect payment details itself.

#### Scenario: Visitor views pricing
- **WHEN** the booking section is visible
- **THEN** the session price, currency, and duration are shown as text before the calendar is activated

#### Scenario: Visitor proceeds to pay
- **WHEN** the visitor selects a paid session slot
- **THEN** payment is completed on Cal.com and the site is never the party handling payment data

## Deferred Alternatives

Form-based email contact (e.g. Formspree, EmailJS) and alternative scheduling providers (e.g. Calendly) remain viable fallbacks. They are not selected here because a Cal.com account already exists with pricing enabled; switching later is a configuration change at the integration point rather than a redesign.
