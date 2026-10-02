import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import styles from "./page.module.css";

const STATUS_LABEL: Record<Project["status"], string> = {
  completed: "Completed",
  "in-progress": "In progress",
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((candidate) => candidate.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <article className={styles.detail}>
        <p className={styles.backLink}>
          <Link href="/">Back to all projects</Link>
        </p>
        <header className={styles.header}>
          <h1>{project.title}</h1>
          <p
            className={styles.status}
            data-status={project.status}
          >
            {STATUS_LABEL[project.status]}
          </p>
        </header>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.tags} aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className={styles.body}>
          {project.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className={styles.links}>
          {project.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} rel="noopener noreferrer" target="_blank">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}