import Link from "next/link";
import type { SiteConfig } from "@/content/types";
import styles from "./TopBar.module.css";

/**
 * Single-tier sticky header with the brand mark and primary navigation. The
 * owner's own name stands in for a brand mark; no third-party logo or trademark
 * is reproduced.
 */
export function TopBar({ site }: { site: SiteConfig }) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <p className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            DB
          </span>
          <span className={styles.brandName}>{site.name}</span>
        </p>
        <ul className={styles.navList}>
          <li>
            <Link className={styles.navLink} href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className={styles.navLink} href="/#projects">
              Projects
            </Link>
          </li>
          <li>
            <Link className={styles.navLink} href="/#preps">
              Interview Preps
            </Link>
          </li>
          <li>
            <Link className={styles.navLink} href="/book">
              Book a Session
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}