import type { BookingConfig } from "./types";

/**
 * Single source of truth for the Cal.com booking URL. The inline embed and the
 * plain fallback link both derive from this, so they cannot drift.
 */
export function bookingUrl(booking: BookingConfig): string {
  const base = `https://cal.com/${booking.handle}`;
  return booking.eventTypeSlug ? `${base}/${booking.eventTypeSlug}` : base;
}

export function formatPrice(booking: BookingConfig): string {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: booking.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(booking.price);

  return `${amount} per ${booking.durationMinutes}-minute session`;
}