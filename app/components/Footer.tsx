import Link from "next/link";
import type { SiteConfig } from "@/content/types";
import styles from "./Footer.module.css";

/**
 * Site footer. Decorative symbols are exposed to assistive technology as text
 * labels so the meaning is not lost, while the emoji themselves are hidden.
 */
export function Footer({ site }: { site: SiteConfig }) {
  const github = site.profiles.find((profile) => /github/i.test(profile.label));

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Made with{" "}
        <span className={styles.symbol} role="img" aria-label="love">
          ❤️
        </span>{" "}
        in{" "}
        <span className={styles.symbol} role="img" aria-label="India">
          🇮🇳
        </span>{" "}
        <span className={styles.divider} aria-hidden="true">·</span> Powered by{" "}
        {github ? (
          <Link href={github.url}>@GitHub</Link>
        ) : (
          <span>@GitHub</span>
        )}
      </p>
    </footer>
  );
}