import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Hosting smoke test</h1>
      <p>Stub content for verifying GitHub Pages deployment.</p>
      {/* `Link` applies the configured basePath; a raw <a href="/service"> would not. */}
      <Link href="/service">Service stub</Link>
    </main>
  );
}