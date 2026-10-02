import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CalEmbed } from "./CalEmbed";
import BookPage from "./page";
import { bookingUrl } from "@/content/booking";
import { site } from "@/content/site";

const CAL_SCRIPT_SRC = "https://app.cal.com/embed/embed.js";

afterEach(() => {
  document.head.querySelectorAll(`script[src="${CAL_SCRIPT_SRC}"]`).forEach((node) =>
    node.remove(),
  );
  vi.restoreAllMocks();
});

describe("BookPage", () => {
  it("names the session and states its duration", () => {
    render(<BookPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: site.booking.sessionName }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${site.booking.durationMinutes} minutes, one to one.`),
    ).toBeInTheDocument();
  });

  it("displays price and currency before the handoff to Cal.com", () => {
    render(<BookPage />);

    const price = screen.getByText(/\$\d/);
    expect(price).toHaveTextContent(site.booking.currency === "USD" ? "$" : "");
    expect(price).toHaveTextContent(`${site.booking.durationMinutes}-minute`);
  });

  it("always renders a plain link to the public Cal.com account", () => {
    render(<BookPage />);

    expect(screen.getByRole("link", { name: /book directly on cal\.com/i })).toHaveAttribute(
      "href",
      "https://cal.com/dibasbehera",
    );
  });

  it("states that scheduling and payment happen on Cal.com", () => {
    render(<BookPage />);

    expect(screen.getByText(/scheduling and payment are handled by cal\.com/i)).toBeInTheDocument();
  });

  it("derives the fallback link and the embed from the same URL", () => {
    render(<BookPage />);

    const href = screen.getByRole("link", { name: /book directly/i }).getAttribute("href");

    expect(href).toBe(bookingUrl(site.booking));
  });
});

describe("CalEmbed", () => {
  it("makes no third-party request before the visitor activates it", () => {
    render(<CalEmbed booking={site.booking} />);

    expect(
      document.head.querySelector(`script[src="${CAL_SCRIPT_SRC}"]`),
    ).toBeNull();
  });

  it("offers an explicit control that is keyboard reachable", async () => {
    render(<CalEmbed booking={site.booking} />);

    const button = screen.getByRole("button", { name: /open the booking calendar/i });
    button.focus();
    expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/loading/i),
    );
  });

  it("shows the calendar frame once the provider script loads", async () => {
    const appended: HTMLScriptElement[] = [];
    vi.spyOn(document.head, "appendChild").mockImplementation(((node: Node) => {
      if (node instanceof HTMLScriptElement) appended.push(node);
      return node;
    }) as typeof document.head.appendChild);

    render(<CalEmbed booking={site.booking} />);
    await userEvent.click(screen.getByRole("button", { name: /open the booking calendar/i }));

    expect(appended[0].src).toBe(CAL_SCRIPT_SRC);
    appended[0].onload?.(new Event("load"));

    await waitFor(() =>
      expect(
        screen.getByTitle(`${site.booking.sessionName} booking calendar`),
      ).toHaveAttribute("src", "https://cal.com/dibasbehera?embed=true"),
    );
  });

  it("falls back with a visible message when the provider script fails", async () => {
    const appended: HTMLScriptElement[] = [];
    vi.spyOn(document.head, "appendChild").mockImplementation(((node: Node) => {
      if (node instanceof HTMLScriptElement) appended.push(node);
      return node;
    }) as typeof document.head.appendChild);

    render(<CalEmbed booking={site.booking} />);
    await userEvent.click(screen.getByRole("button", { name: /open the booking calendar/i }));

    appended[0].onerror?.(new Event("error"));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/could not be loaded/i),
    );
  });
});

describe("booking fallback when the embed is blocked", () => {
  it("keeps the direct booking link usable without the embed", async () => {
    const appended: HTMLScriptElement[] = [];
    vi.spyOn(document.head, "appendChild").mockImplementation(((node: Node) => {
      if (node instanceof HTMLScriptElement) appended.push(node);
      return node;
    }) as typeof document.head.appendChild);

    render(<BookPage />);
    await userEvent.click(screen.getByRole("button", { name: /open the booking calendar/i }));

    appended[0].onerror?.(new Event("error"));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/could not be loaded/i),
    );
    // The fallback the visitor is directed to.
    expect(screen.getByRole("link", { name: /book directly on cal\.com/i })).toHaveAttribute(
      "href",
      "https://cal.com/dibasbehera",
    );
  });
});