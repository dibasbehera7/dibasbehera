import { CalEmbed } from "./CalEmbed";
import { formatPrice } from "@/content/booking";
import { site } from "@/content/site";
import styles from "./page.module.css";

export const metadata = {
  title: "Book a 1:1 session | Dibas Behera",
  description: `Book a 1:1 engineering session. ${formatPrice(site.booking)}.`,
};

export default function BookPage() {
  const { booking } = site;

  return (
    <main>
      <section className={styles.booking} aria-labelledby="booking-heading">
        <h1 id="booking-heading">{booking.sessionName}</h1>

        {/* Price and duration together, before the calendar is activated. */}
        <p className={styles.price}>{formatPrice(booking)}</p>

        <CalEmbed booking={booking} />
      </section>
    </main>
  );
}