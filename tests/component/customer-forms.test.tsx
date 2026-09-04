import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccountBookings, AccountOverview, SignInForm, SignUpForm, VerifyEmailForm } from "@/components/customer/customer-forms";

describe("customer account forms", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("has labelled keyboard-accessible fields and keeps guest booking available on sign-up", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await user.tab();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText(/passphrase/i)).toHaveAttribute("minLength", "12");
    expect(screen.getByRole("link", { name: /book as guest/i })).toHaveAttribute("href", "/book");
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("renders Continue with Google button consistently on sign-in", () => {
    render(<SignInForm />);
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passphrase/i)).toBeInTheDocument();
  });

  it("renders email verification with 10-minute expiry and resend capability", () => {
    render(<VerifyEmailForm />);
    expect(screen.getByText(/expires after 10 minutes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enter your email to resend/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send new verification link/i })).toBeInTheDocument();
  });

  it("renders AccountOverview with avatar and verify account button beside avatar when unverified", async () => {
    const unverifiedAccount = {
      id: "cust-1",
      email: "alex@example.com",
      displayName: "Alex Rivera",
      phone: "+60123456789",
      age: 28,
      status: "pending",
      verifiedAt: null,
      passwordSet: true,
      googleLinked: false,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { account: unverifiedAccount }, error: null }),
      }),
    );

    render(<AccountOverview />);

    await waitFor(() => {
      expect(screen.getByText("AR")).toBeInTheDocument();
      expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
      expect(screen.getByText("Unverified")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /verify account/i })).toBeInTheDocument();
    });
  });

  it("renders AccountOverview with verified badge when account is active", async () => {
    const verifiedAccount = {
      id: "cust-2",
      email: "sam@example.com",
      displayName: "Sam Lee",
      phone: "+60123456780",
      age: 30,
      status: "active",
      verifiedAt: "2026-09-01T12:00:00Z",
      passwordSet: true,
      googleLinked: true,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { account: verifiedAccount }, error: null }),
      }),
    );

    render(<AccountOverview />);

    await waitFor(() => {
      expect(screen.getByText("SL")).toBeInTheDocument();
      expect(screen.getByText("Sam Lee")).toBeInTheDocument();
      expect(screen.getAllByText("Verified").length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByRole("button", { name: /verify account/i })).not.toBeInTheDocument();
    });
  });

  it("renders AccountBookings safely with empty bookings and points guest link to /booking/find", async () => {
    const activeAccount = {
      id: "cust-3",
      email: "player@example.com",
      displayName: "Player One",
      phone: "+60123456789",
      age: 24,
      status: "active",
      verifiedAt: "2026-09-01T12:00:00Z",
      passwordSet: true,
      googleLinked: false,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("/session")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ data: { account: activeAccount }, error: null }),
          });
        }
        if (url.includes("/bookings")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ data: [], error: null }),
          });
        }
        return Promise.resolve({ ok: true, json: async () => ({ data: null, error: null }) });
      }),
    );

    render(<AccountBookings />);

    await waitFor(() => {
      expect(screen.getByText(/no account-owned bookings yet/i)).toBeInTheDocument();
      const findLink = screen.getByRole("link", { name: /find guest booking/i });
      expect(findLink).toHaveAttribute("href", "/booking/find");
    });
  });

  it("renders AccountBookings without throwing TypeError when bookings API returns non-array data", async () => {
    const activeAccount = {
      id: "cust-4",
      email: "player4@example.com",
      displayName: "Player Four",
      phone: "+60123456789",
      age: 25,
      status: "active",
      verifiedAt: "2026-09-01T12:00:00Z",
      passwordSet: true,
      googleLinked: false,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("/session")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ data: { account: activeAccount }, error: null }),
          });
        }
        if (url.includes("/bookings")) {
          // Simulating corrupted object response
          return Promise.resolve({
            ok: true,
            json: async () => ({ data: { notAnArray: true }, error: null }),
          });
        }
        return Promise.resolve({ ok: true, json: async () => ({ data: null, error: null }) });
      }),
    );

    render(<AccountBookings />);

    await waitFor(() => {
      expect(screen.getByText(/no account-owned bookings yet/i)).toBeInTheDocument();
    });
  });
});
