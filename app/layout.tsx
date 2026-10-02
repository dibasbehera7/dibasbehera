import type { Metadata } from "next";
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
 * Third-party origins are added when the booking embed is introduced.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} />
      </head>
      <body>{children}</body>
    </html>
  );
}