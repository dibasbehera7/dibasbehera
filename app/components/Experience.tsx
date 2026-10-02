import type { ExperienceEntry } from "@/content/types";
import styles from "./Experience.module.css";

export function Experience({ experience }: { experience: ExperienceEntry[] }) {
  return (
    <section className={styles.experience} aria-labelledby="experience-heading">
      <h2 id="experience-heading">Experience</h2>
      <ol className={styles.timeline}>
        {experience.map((entry) => (
          <li key={`${entry.company}-${entry.period}`} className={styles.entry}>
            <p className={styles.period}>{entry.period}</p>
            <h3 className={styles.role}>
              {entry.role}, {entry.company}
            </h3>
            <p className={styles.domain}>{entry.domain}</p>
            <ul className={styles.highlights}>
              {entry.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <ul className={styles.technologies} aria-label={`${entry.company} technologies`}>
              {entry.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}