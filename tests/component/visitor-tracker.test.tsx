import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";

describe("VisitorTracker component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    document.cookie = "axs_consent=; max-age=0; path=/";
  });

  it("renders the cookie notice when no prior consent exists", async () => {
    render(<VisitorTracker />);
    expect(await screen.findByRole("region", { name: /cookie notice/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /decline/i })).toBeInTheDocument();
  });

  it("sets consent cookie and localStorage and hides the notice when Accept is clicked", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { token: "vis-tok-123" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<VisitorTracker />);

    const acceptBtn = await screen.findByRole("button", { name: /accept/i });
    await user.click(acceptBtn);

    await waitFor(() => {
      expect(screen.queryByRole("region", { name: /cookie notice/i })).not.toBeInTheDocument();
    });

    expect(window.localStorage.getItem("axs_consent")).toBe("accepted");
    expect(document.cookie).toContain("axs_consent=accepted");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/axs/v1/public/visitors",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ consent: true, pagePath: window.location.pathname }),
      }),
    );
  });

  it("sets decline cookie and localStorage and hides the notice when Decline is clicked", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<VisitorTracker />);

    const declineBtn = await screen.findByRole("button", { name: /decline/i });
    await user.click(declineBtn);

    await waitFor(() => {
      expect(screen.queryByRole("region", { name: /cookie notice/i })).not.toBeInTheDocument();
    });

    expect(window.localStorage.getItem("axs_consent")).toBe("declined");
    expect(document.cookie).toContain("axs_consent=declined");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not render when initialConsent is provided from server", () => {
    render(<VisitorTracker initialConsent="accepted" />);
    expect(screen.queryByRole("region", { name: /cookie notice/i })).not.toBeInTheDocument();
  });

  it("does not render when consent is already set in cookies or localStorage", async () => {
    window.localStorage.setItem("axs_consent", "accepted");
    render(<VisitorTracker />);
    await waitFor(() => {
      expect(screen.queryByRole("region", { name: /cookie notice/i })).not.toBeInTheDocument();
    });
  });
});
