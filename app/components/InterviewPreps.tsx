"use client";

import { useRef, useState } from "react";
import type { PrepItem } from "@/content/types";
import styles from "./InterviewPreps.module.css";

export function InterviewPreps({ items }: { items: PrepItem[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<PrepItem | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function syncEdges() {
    const rail = railRef.current;
    if (!rail) return;

    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft >= maxScroll - 1);
  }

  function open(item: PrepItem) {
    setActive(item);
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
    <section className={styles.preps} id="preps" aria-labelledby="preps-heading">
      <h2 id="preps-heading">Interview Preps</h2>
      <div className="card-rail-wrapper">
        <button
          type="button"
          className={styles.arrow}
          aria-label="Scroll interview preparation topics backwards"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <ul
          id="preps-rail"
          ref={railRef}
          className="card-rail"
          tabIndex={0}
          aria-label="interview preparation topics, scroll horizontally for more"
          onScroll={syncEdges}
        >
          {items.map((item) => (
            <li key={item.title} className={styles.card}>
              <h3 className={styles.title}>{item.title}</h3>
              <ul className={styles.topics} aria-label={`${item.title} topics`}>
                {item.topics.map((topic) => (
                  <li key={topic} className={styles.topic}>
                    {topic}
                  </li>
                ))}
              </ul>
              <ul className={styles.links}>
                {item.links.map((link) => (
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
              <button
                type="button"
                className={styles.overlay}
                aria-label={`Show details for ${item.title}`}
                onClick={() => open(item)}
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={styles.arrow}
          aria-label="Scroll interview preparation topics forwards"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <dialog
        className={styles.dialog}
        ref={dialogRef}
        aria-label={active ? `Show details for ${active.title}` : "Preparation details"}
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
            <ul className={styles.topics} aria-label={`${active.title} topics`}>
              {active.topics.map((topic) => (
                <li key={topic} className={styles.topic}>
                  {topic}
                </li>
              ))}
            </ul>
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
          </div>
        )}
      </dialog>
    </section>
  );
}