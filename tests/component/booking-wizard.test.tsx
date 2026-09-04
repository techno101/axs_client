import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BookingWizard } from "@/components/booking/booking-wizard";
import type { AvailabilitySlot } from "@/lib/api/types";
import { blocks, fields } from "@/lib/content";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("BookingWizard", () => {
  it("adds an available session tile and continues to customer details", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === "POST") return Response.json({ data: { token: "h".repeat(43), expiresAt: "2026-07-18T04:10:00.000Z", fieldId: "FIELD_01", blockCode: "MORNING", bookingDate: "2026-07-18", amountMinor: 60000, currency: "MYR", state: "active" }, meta: {}, error: null }, { status: 201 });
      return Response.json({ data: availability.map((slot) => ({ fieldId: slot.fieldId, blockCode: slot.blockId, state: slot.status })), meta: {}, error: null });
    }));
    const user = userEvent.setup();
    const availability: AvailabilitySlot[] = [
      { fieldId: "FIELD_01", blockId: "MORNING", status: "available" },
      { fieldId: "FIELD_01", blockId: "EVENING", status: "held" },
      { fieldId: "FIELD_02", blockId: "MORNING", status: "booked" },
      { fieldId: "FIELD_02", blockId: "EVENING", status: "blocked" },
    ];
    render(<BookingWizard fields={fields} blocks={blocks} availability={availability} addons={[]} onlinePayment={{ enabled: true }} businessDate="2026-07-16" initialDate="2026-07-18" />);

    expect(screen.getByRole("heading", { name: "Pick your sessions" })).toBeVisible();
    await user.click(screen.getAllByRole("button", { name: /available.*field 1/i })[0]);

    expect(screen.getByText("1 session")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByRole("heading", { name: "Your details" })).toBeVisible();
    expect(screen.getByLabelText("Full name")).toBeRequired();
    expect(screen.getByLabelText(/Email/)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/Email/)).not.toBeRequired();
  });

  it("shows a simple note and blocks checkout when online payment is unavailable", async () => {
    const fetch = vi.fn(async () => Response.json({ data: [
      { fieldId: "FIELD_01", blockCode: "MORNING", state: "available" },
      { fieldId: "FIELD_01", blockCode: "EVENING", state: "available" },
    ], meta: {}, error: null }));
    vi.stubGlobal("fetch", fetch);
    const user = userEvent.setup();
    const availability: AvailabilitySlot[] = [
      { fieldId: "FIELD_01", blockId: "MORNING", status: "available" },
      { fieldId: "FIELD_01", blockId: "EVENING", status: "available" },
    ];
    render(<BookingWizard fields={fields} blocks={blocks} availability={availability} addons={[]} onlinePayment={{ enabled: false, publicMessage: "Online booking will open again soon." }} businessDate="2026-07-16" initialDate="2026-07-18" />);

    await user.click(screen.getAllByRole("button", { name: /available.*field 1/i })[0]);

    expect(screen.getByText(/online booking will open again soon/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
    const calls = fetch.mock.calls as unknown as Array<[RequestInfo | URL, RequestInit?]>;
    expect(calls.some(([, init]) => init?.method === "POST")).toBe(false);
    expect(screen.queryByRole("heading", { name: "Your details" })).not.toBeInTheDocument();
  });

  it("allows removing a session from the cart drawer via the remove button", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === "POST") return Response.json({ data: { token: "h".repeat(43), expiresAt: "2026-07-18T04:10:00.000Z", fieldId: "FIELD_01", blockCode: "MORNING", bookingDate: "2026-07-18", amountMinor: 60000, currency: "MYR", state: "active" }, meta: {}, error: null }, { status: 201 });
      return Response.json({ data: [{ fieldId: "FIELD_01", blockCode: "MORNING", state: "available" }], meta: {}, error: null });
    }));
    const user = userEvent.setup();
    const availability: AvailabilitySlot[] = [
      { fieldId: "FIELD_01", blockId: "MORNING", status: "available" },
    ];
    render(<BookingWizard fields={fields} blocks={blocks} availability={availability} addons={[]} onlinePayment={{ enabled: true }} businessDate="2026-07-16" initialDate="2026-07-18" />);

    await user.click(screen.getAllByRole("button", { name: /available.*field 1/i })[0]);
    expect(screen.getByText("1 session")).toBeVisible();

    // Open cart drawer
    await user.click(screen.getByRole("button", { name: /1 session/i }));
    const removeBtn = screen.getByRole("button", { name: /remove field 1 session/i });
    expect(removeBtn).toBeInTheDocument();

    // Click remove button
    await user.click(removeBtn);
    expect(screen.getByText("No sessions")).toBeVisible();
    expect(screen.getByText("Pick a session above to add it here.")).toBeVisible();
  });

  it("redirects browser to payment provider URL upon order creation and displays SST notice", async () => {
    const assignMock = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      configurable: true,
      value: { ...originalLocation, assign: assignMock, href: "http://localhost:3000/" },
    });
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(_input);
      if (init?.method === "POST" && url.includes("/hold-groups")) {
        return Response.json({ data: { token: "h".repeat(43), expiresAt: "2026-07-18T04:10:00.000Z" }, meta: {}, error: null }, { status: 201 });
      }
      if (url.includes("/orders") && !url.includes("/payment-attempts")) {
        return Response.json({ data: { reference: "AXO-TEST123", accessToken: "token-123", amountMinor: 60000 }, meta: {}, error: null }, { status: 201 });
      }
      if (url.includes("/payment-attempts")) {
        return Response.json({ data: { status: "created", redirectUrl: "https://sandbox.hitpayapp.com/pay/test123" }, meta: {}, error: null }, { status: 201 });
      }
      return Response.json({ data: [{ fieldId: "FIELD_01", blockCode: "MORNING", state: "available" }], meta: {}, error: null });
    }));

    const user = userEvent.setup();
    const availability: AvailabilitySlot[] = [
      { fieldId: "FIELD_01", blockId: "MORNING", status: "available" },
    ];
    render(<BookingWizard fields={fields} blocks={blocks} availability={availability} addons={[]} onlinePayment={{ enabled: true }} businessDate="2026-07-16" initialDate="2026-07-18" />);

    await user.click(screen.getAllByRole("button", { name: /available.*field 1/i })[0]);
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByRole("heading", { name: "Your details" })).toBeVisible();
    expect(screen.getByText(/All prices are inclusive of applicable SST/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText("Full name"), "Ahmad Razak");
    await user.type(screen.getByLabelText("Mobile number"), "0123456789");

    await user.click(screen.getByRole("button", { name: /continue to payment/i }));

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith("https://sandbox.hitpayapp.com/pay/test123");
    });

    const calls = (fetch as unknown as { mock: { calls: Array<[RequestInfo | URL, RequestInit?]> } }).mock.calls;
    const paymentCall = calls.find(([u]) => String(u).includes("/payment-attempts"));
    expect(paymentCall).toBeDefined();
    const body = JSON.parse(paymentCall![1]!.body as string);
    expect(body.returnPath).toBe("/booking/result?order=AXO-TEST123");
  });
});

