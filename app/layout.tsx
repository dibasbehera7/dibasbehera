import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dibas Behera | Software Engineer",
  description:
    "Portfolio of Dibas Behera: software engineering projects, technical skills, and professional experience.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * GitHub Pages serves static files and does not let a repository set arbitrary
 * response headers, so the Content-Security-Policy is delivered as a meta tag.
 *
 * `frame-ancestors` is deliberately absent: it is ignored when a CSP is
 * delivered via a <meta> element, and including it logs a console error. Clickjacking
 * protection would need a real response header, which GitHub Pages does not offer.
 *
 * `https://app.cal.com` is the only third-party origin: it loads the booking
 * embed's script and is the frame the calendar is served in. No analytics or
 * advertising origin is permitted.
 *
 * `'unsafe-eval'` is added in development only: React's development build uses
 * `eval()` to reconstruct component callstacks, so omitting it makes the dev
 * server log a console error on every page. The production build never calls
 * `eval()`, so the deployed policy stays strict.
 */
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com"
    : "'self' 'unsafe-inline' https://app.cal.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://app.cal.com",
  "font-src 'self' https://app.cal.com",
  "connect-src 'self' https://app.cal.com",
  "frame-src https://cal.com https://app.cal.com",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} />
      </head>
      <body>{children}</body>
    </html>
  );
}