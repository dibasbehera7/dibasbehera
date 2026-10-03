# Proposal

## Why

Establish a professional personal portfolio website hosted on GitHub Pages to showcase current and ongoing software engineering projects, technical skills, and experience.

## What Changes

- Create a static personal portfolio web application designed for deployment on GitHub Pages.
- Include structured sections for showcase projects, technical skills, background experience, and contact information.
- Ensure responsive design, accessibility, fast page loading, and ease of content updates.
- Add a 1:1 session booking section that links the public Cal.com account `https://cal.com/dibasbehera`, with paid-session pricing enabled. Booking and payment are executed entirely by Cal.com; the site only surfaces the entry point and links out.

## Capabilities

### New Capabilities

- `portfolio-website`: Capabilities covering personal portfolio structure, project showcase presentation, skills overview, responsive layout, and GitHub Pages deployment configuration.
- `session-booking`: 1:1 session booking entry point that surfaces the public Cal.com account, including paid-session pricing display and fallback link-out behaviour.

### Modified Capabilities

(None - initial project setup)

## Impact

- Target host: GitHub Pages (static site hosting).
- New frontend asset structure and deployment pipeline/workflow (e.g., GitHub Actions for deployment).
- Third-party runtime dependency: Cal.com booking surface for the public account `https://cal.com/dibasbehera`. Availability, timezone handling, confirmations, reminders, and payments are owned by Cal.com.

## Non-goals

- Building or hosting a scheduling system, calendar, availability engine, or payment processing on our side. No booking state is stored by this site and no payment data touches it.
- Dynamic server-side rendering or database backend requirements.
