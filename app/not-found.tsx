import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>
        That page does not exist. It may have been renamed, or the project may no
        longer be listed.
      </p>
      <p>
        <Link href="/">Back to the home page</Link>
      </p>
    </main>
  );
}