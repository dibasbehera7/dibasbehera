import type { SiteConfig } from "@/content/types";
import styles from "./Intro.module.css";

export function Intro({ site }: { site: SiteConfig }) {
  return (
    <section className={styles.intro} aria-labelledby="intro-heading">
      <div className={styles.inner}>
        <h1 id="intro-heading">{site.name}</h1>
        <p className={styles.role}>{site.role}</p>
        <p className={styles.tagline}>{site.tagline}</p>
        <p className={styles.body}>{site.introduction}</p>
      </div>
    </section>
  );
}