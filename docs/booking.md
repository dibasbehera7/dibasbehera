# Booking a 1:1 session

Booking runs entirely on **Cal.com**. This site stores no booking, payment, or
visitor details — it only links out.

- Account: <https://cal.com/dibasbehera>
- Default session: 45 minutes, paid

The Cal.com handle is independent of the GitHub username, so `cal.com/dibasbehera`
is correct even though the GitHub account is `dibasbehera7`.

## How it works

`/book` shows the session name, duration, and price as text, then offers two ways
to book:

1. **Inline calendar** — activating "Open the booking calendar" loads Cal.com's
   embed and renders the calendar in place.
2. **Direct link** — a permanent "Book directly on Cal.com" link.

The direct link is always visible and works with JavaScript disabled, when the
embed is blocked, or if Cal.com is unreachable. Both the embed and the link derive
from one config value, so they cannot drift apart.

Payment is completed on Cal.com. This site never handles payment data.

## Configuration

All booking settings live in `app/content/site.ts`:

```ts
booking: {
  provider: "cal",
  handle: "dibasbehera",   // Cal.com account handle
  eventTypeSlug: undefined, // set to deep-link a specific event type
  sessionName: "1:1 Engineering Session",
  durationMinutes: 45,
  price: 49,
  currency: "USD",
}
```

`bookingUrl()` in `app/content/booking.ts` is the single source of truth for the
booking URL; the embed and the fallback link both call it.

### Changing the price or duration

The price and duration shown here are a **mirror** of the Cal.com configuration.
Cal.com is the source of truth for what is actually charged. If you change either
on Cal.com, update `app/content/site.ts` too.

To change the duration shown, also update `durationMinutes`. The duration is used
only for display; Cal.com decides the real slot length.

### Deep-linking an event type

`cal.com/dibasbehera` may show a list of event types. To link straight to one,
set `eventTypeSlug` to that event's slug:

```ts
eventTypeSlug: "1-1-session"
```

which produces `https://cal.com/dibasbehera/1-1-session`.

## Content-Security-Policy

The booking page loads third-party assets from Cal.com, so the CSP in
`app/layout.tsx` allows those origins and nothing else. The permitted origins are:

| Directive | Origin | Purpose |
| --- | --- | --- |
| `script-src` | `https://app.cal.com` | Embed script |
| `img-src`, `font-src` | `https://app.cal.com` | Embed assets |
| `connect-src` | `https://app.cal.com` | Embed network calls |
| `frame-src` | `https://cal.com`, `https://app.cal.com` | The calendar frame |

No other third-party origin is permitted. `npm run check:browser` fails the build
if a CSP violation appears in the console, including after the embed is activated.

`frame-ancestors` is deliberately absent: it is ignored when a policy is delivered
via a `<meta>` tag, and including it logs a console error. GitHub Pages cannot set
response headers, so clickjacking protection is not available without moving off
Pages.

## Privacy posture

- **No analytics and no advertising.** No third-party script is loaded other than
  Cal.com's, and only after the visitor activates the calendar.
- **No site-owned visitor tracking.** The site sets no visitor-identifying
  cookies of its own and runs no tracking script.
- **The embed is loaded on interaction**, not on page view, so no Cal.com request
  or cookie occurs until the visitor asks for the calendar.
- **Cal.com's own cookies apply** once the embed loads, governed by Cal.com's
  privacy policy and cookie settings. This site cannot control them.
- **No personal data is published.** The site shows no email address and no
  `mailto:` link anywhere; the GitHub profile is the only identity link.
- If analytics are ever added, they must sit behind a consent gate that defaults
  to not loading, and be documented here.

## Verification

`npm run check:live` (with `SITE_URL` set) asserts that the booking page shows a
price, always links to `https://cal.com/dibasbehera`, and carries a
Content-Security-Policy.

A full end-to-end booking, including payment, is verified manually.