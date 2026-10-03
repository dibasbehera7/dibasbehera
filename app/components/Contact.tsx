import Link from "next/link";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section className={styles.contact} aria-labelledby="contact-heading">
      {/* Booking is the only content in this section; no body copy. */}
      <div className={styles.header}>
        <h2 id="contact-heading">Contact</h2>
        <Link className={styles.bookButton} href="/book">
          Book a 1:1 session
        </Link>
      </div>
    </section>
  );
}