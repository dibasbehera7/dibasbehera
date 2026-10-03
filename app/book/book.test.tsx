import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CalEmbed } from "./CalEmbed";
import BookPage from "./page";
import { formatPrice } from "@/content/booking";
import { site } from "@/content/site";

const CAL_SCRIPT_SRC = "https://app.cal.com/embed/embed.js";

afterEach(() => {
  document.head.querySelectorAll(`script[src="${CAL_SCRIPT_SRC}"]`).forEach((node) =>
    node.remove(),
  );
  vi.restoreAllMocks();
});

describe("BookPage", () => {
  it("shows only the session name and its price", () => {
    render(<BookPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: site.booking.sessionName }),
    ).toBeInTheDocument();
    expect(screen.getByText(formatPrice(site.booking))).toBeInTheDocument();
  });

  it("shows price, currency, and duration together before the calendar loads", () => {
    render(<BookPage />);

    const price = screen.getByText(/\$\d/);
    expect(price).toHaveTextContent(`${site.booking.durationMinutes}-minute`);
  });

  it("offers a control that opens the calendar in place", () => {
    render(<BookPage />);

    expect(
      screen.getByRole("button", { name: /open the booking calendar/i }),
    ).toBeInTheDocument();
  });

  it("carries no direct-link fallback and no explanatory body copy", () => {
    render(<BookPage />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText(/handled by cal\.com/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/45 minutes, one to two|one to one/i)).not.toBeInTheDocument();
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

describe("when the provider script fails", () => {
  it("explains the failure and names the Cal.com account", async () => {
    const appended: HTMLScriptElement[] = [];
    vi.spyOn(document.head, "appendChild").mockImplementation(((node: Node) => {
      if (node instanceof HTMLScriptElement) appended.push(node);
      return node;
    }) as typeof document.head.appendChild);

    render(<BookPage />);
    await userEvent.click(
      screen.getByRole("button", { name: /open the booking calendar/i }),
    );

    appended[0].onerror?.(new Event("error"));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/could not be loaded/i),
    );
    expect(screen.getByRole("status")).toHaveTextContent(site.booking.handle);
  });
});