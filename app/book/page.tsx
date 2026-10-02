import { CalEmbed } from "./CalEmbed";
import { bookingUrl, formatPrice } from "@/content/booking";
import { site } from "@/content/site";
import styles from "./page.module.css";

export const metadata = {
  title: "Book a 1:1 session | Dibas Behera",
  description: `Book a 1:1 engineering session. ${formatPrice(site.booking)}.`,
};

export default function BookPage() {
  const { booking } = site;
  const url = bookingUrl(booking);

  return (
    <main>
      <section className={styles.booking} aria-labelledby="booking-heading">
        <h1 id="booking-heading">{booking.sessionName}</h1>

        <p className={styles.duration}>
          {booking.durationMinutes} minutes, one to one.
        </p>

        {/* Price is shown before the handoff so the visitor knows the cost
            before leaving the site. */}
        <p className={styles.price}>{formatPrice(booking)}</p>

        <CalEmbed booking={booking} />

        {/* Always-visible fallback: works with JavaScript disabled, when the
            embed is blocked, or if Cal.com is unreachable. */}
        <p className={styles.fallback}>
          <a
            className={styles.fallbackLink}
            href={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Book directly on Cal.com
          </a>
        </p>

        <p className={styles.note}>
          Scheduling and payment are handled by Cal.com. This site stores no
          booking or payment details.
        </p>
      </section>
    </main>
  );
}