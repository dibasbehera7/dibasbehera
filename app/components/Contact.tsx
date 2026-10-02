import Link from "next/link";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section className={styles.contact} aria-labelledby="contact-heading">
      {/* Booking is the single contact action; it sits on the heading row at
          desktop width and stacks below it on narrow viewports. */}
      <div className={styles.header}>
        <h2 id="contact-heading">Contact</h2>
        <Link className={styles.bookButton} href="/book">
          Book a 1:1 session
        </Link>
      </div>
      <p className={styles.prompt}>
        Want to walk through an architecture problem, a code review, or a career
        question? Book a 1:1 session.
      </p>
    </section>
  );
}