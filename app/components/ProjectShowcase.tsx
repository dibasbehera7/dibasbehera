"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Project } from "@/content/types";
import styles from "./ProjectShowcase.module.css";

const STATUS_LABEL: Record<Project["status"], string> = {
  completed: "Completed",
  "in-progress": "In progress",
};

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The single dialog renders the selected project on demand, so each project's
  // detail is not duplicated into the initial HTML for every card.
  const [active, setActive] = useState<Project | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function syncEdges() {
    const rail = railRef.current;
    if (!rail) return;

    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft >= maxScroll - 1);
  }

  function open(project: Project) {
    setActive(project);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function scrollByCard(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;

    const card = rail.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(rail).columnGap || "0") || 0;
    const step = card ? card.offsetWidth + gap : rail.clientWidth;

    rail.scrollBy({ left: step * direction, behavior: "smooth" });
    window.setTimeout(syncEdges, 350);
  }

  return (
    <section
      className={styles.showcase}
      id="projects"
      aria-labelledby="projects-heading"
    >
      <h2 id="projects-heading">Projects</h2>
      <div className="card-rail-wrapper">
        <button
          type="button"
          className={styles.arrow}
          aria-label="Scroll featured projects backwards"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <ul
          id="projects-rail"
          ref={railRef}
          className="card-rail"
          tabIndex={0}
          aria-label="featured projects, scroll horizontally for more"
          onScroll={syncEdges}
        >
          {projects.map((project) => (
            <li key={project.slug} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  {/* The stretched ::after makes the whole card clickable without
                      adding a second interactive element on top of the
                      repository link, which would overlap it. */}
                  <button
                    type="button"
                    className={styles.cardButton}
                    aria-label={`Show details for ${project.title}`}
                    onClick={() => open(project)}
                  >
                    {project.title}
                  </button>
                </h3>
                <p className={styles.status} data-status={project.status}>
                  {STATUS_LABEL[project.status]}
                </p>
              </div>
              <p className={styles.summary}>{project.summary}</p>
              {project.tags.length > 0 && (
                <ul
                  className={styles.tags}
                  aria-label={`${project.title} technologies`}
                >
                  {project.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              <ul className={styles.links}>
                {project.links.map((link) => (
                  <li key={link.url}>
                    <a
                      className={styles.linkButton}
                      href={link.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.arrow}
          aria-label="Scroll featured projects forwards"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <dialog
        className={styles.dialog}
        ref={dialogRef}
        aria-label={active ? `Show details for ${active.title}` : "Project details"}
        onClick={(event) => event.stopPropagation()}
      >
        {active && (
          <div className={styles.dialogInner}>
            <button
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Close details"
            >
              <span aria-hidden="true">×</span>
            </button>
            <h3 className={styles.detailTitle}>{active.title}</h3>
            <p className={styles.status} data-status={active.status}>
              {STATUS_LABEL[active.status]}
            </p>
            <ul className={styles.tags} aria-label={`${active.title} technologies`}>
              {active.tags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
            <p className={styles.summary}>{active.summary}</p>
            {active.body.map((paragraph) => (
              <p key={paragraph} className={styles.detailParagraph}>
                {paragraph}
              </p>
            ))}
            <ul className={styles.links}>
              {active.links.map((link) => (
                <li key={link.url}>
                  <a
                    className={styles.linkButton}
                    href={link.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.detailLink}>
              {/* `Link` applies the configured basePath; a raw href would not. */}
              <Link href={`/projects/${active.slug}`}>
                Open the full project page
              </Link>
            </p>
          </div>
        )}
      </dialog>
    </section>
  );
}