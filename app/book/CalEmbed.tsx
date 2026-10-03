"use client";

import { useState } from "react";
import { bookingUrl } from "@/content/booking";
import type { BookingConfig } from "@/content/types";
import styles from "./CalEmbed.module.css";

const CAL_SCRIPT_SRC = "https://app.cal.com/embed/embed.js";

/**
 * Cal.com inline embed.
 *
 * The provider script is injected only after the visitor activates the control,
 * so no third-party request is made before that point and no provider cookie is
 * set on page view. Activating the control renders the calendar in place.
 */
export function CalEmbed({ booking }: { booking: BookingConfig }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">(
    "idle",
  );

  async function open() {
    setStatus("loading");

    try {
      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(
          `script[src="${CAL_SCRIPT_SRC}"]`,
        );

        if (existing) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = CAL_SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Cal.com script failed to load"));
        document.head.appendChild(script);
      });

      setStatus("ready");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className={styles.embed}>
      {status === "idle" && (
        <button type="button" className={styles.openButton} onClick={open}>
          Open the booking calendar
        </button>
      )}

      {status === "loading" && (
        <p className={styles.status} role="status">
          Loading the booking calendar…
        </p>
      )}

      {status === "ready" && (
        <iframe
          className={styles.frame}
          title={`${booking.sessionName} booking calendar`}
          src={`${bookingUrl(booking)}?embed=true`}
        />
      )}

      {status === "failed" && (
        <p className={styles.status} role="status">
          The booking calendar could not be loaded. Please try again, or open
          Cal.com directly at cal.com/{booking.handle}.
        </p>
      )}
    </div>
  );
}