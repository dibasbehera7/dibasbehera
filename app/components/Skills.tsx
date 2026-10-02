import type { SkillGroup } from "@/content/types";
import styles from "./Skills.module.css";

export function Skills({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <section className={styles.skills} aria-labelledby="skills-heading">
      <h2 id="skills-heading">Skills</h2>
      <dl className={styles.grid}>
        {skillGroups.map((group) => (
          <div key={group.category} className={styles.group}>
            <dt className={styles.category}>{group.category}</dt>
            <dd className={styles.items}>
              <ul className={styles.list}>
                {group.skills.map((skill) => (
                  <li key={skill} className={styles.item}>
                    {skill}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}