import { describe, expect, it } from "vitest";
import { bookingUrl, formatPrice } from "./booking";
import { site } from "./site";
import type { BookingConfig } from "./types";

const base: BookingConfig = {
  provider: "cal",
  handle: "dibasbehera",
  sessionName: "1:1 Engineering Session",
  durationMinutes: 45,
  price: 49,
  currency: "USD",
};

describe("bookingUrl", () => {
  it("derives the account URL from the configured handle", () => {
    expect(bookingUrl(base)).toBe("https://cal.com/dibasbehera");
  });

  it("appends the event type slug when one is configured", () => {
    expect(bookingUrl({ ...base, eventTypeSlug: "1-1-session" })).toBe(
      "https://cal.com/dibasbehera/1-1-session",
    );
  });

  it("resolves the configured site booking handle to cal.com/dibasbehera", () => {
    expect(bookingUrl(site.booking)).toBe("https://cal.com/dibasbehera");
  });
});

describe("formatPrice", () => {
  it("renders price and currency together with the duration", () => {
    expect(formatPrice(base)).toBe("$49 per 45-minute session");
  });

  it("respects a different currency", () => {
    expect(formatPrice({ ...base, currency: "EUR" })).toBe("€49 per 45-minute session");
  });
});