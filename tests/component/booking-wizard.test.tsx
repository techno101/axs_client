import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BookingWizard } from "@/components/booking/booking-wizard";
import type { AvailabilitySlot } from "@/lib/api/types";
import { blocks, fields } from "@/lib/content";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("BookingWizard", () => {
  it("moves from date through an available block to customer details", async () => {
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
    render(<BookingWizard fields={fields} blocks={blocks} availability={availability} onlinePayment={{ enabled: true }} businessDate="2026-07-16" initialDate="2026-07-18" />);

    expect(screen.getByRole("heading", { name: "Choose your date" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /choose field/i }));
    await user.click(screen.getByRole("button", { name: /field 1/i }));
    await user.click(screen.getByRole("button", { name: /choose block/i }));
    await user.click(screen.getAllByRole("button", { name: /available.*field 1/i })[0]);
    await user.click(screen.getByRole("button", { name: /add to booking/i }));

    expect(await screen.findByRole("heading", { name: "Who is booking?" })).toBeVisible();
    expect(screen.getByLabelText("Full name")).toBeRequired();
    expect(screen.getByLabelText(/Email address/)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/Email address/)).not.toBeRequired();
  });

  it("stops before a public hold when online payment is disabled", async () => {
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
    render(<BookingWizard fields={fields} blocks={blocks} availability={availability} onlinePayment={{ enabled: false, publicMessage: "Online payment is awaiting merchant verification." }} businessDate="2026-07-16" initialDate="2026-07-18" />);

    await user.click(screen.getByRole("button", { name: /choose field/i }));
    await user.click(screen.getByRole("button", { name: /field 1/i }));
    await user.click(screen.getByRole("button", { name: /choose block/i }));
    await user.click(screen.getAllByRole("button", { name: /available.*field 1/i })[0]);

    expect(screen.getByText(/online payment is awaiting merchant verification/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /online payment unavailable/i })).toBeDisabled();
    const calls = fetch.mock.calls as unknown as Array<[RequestInfo | URL, RequestInit?]>;
    expect(calls.some(([, init]) => init?.method === "POST")).toBe(false);
    expect(screen.queryByRole("heading", { name: "Who is booking?" })).not.toBeInTheDocument();
  });

  it("keeps an unmistakable non-production banner visible for sandbox checkout", () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ data: [], meta: {}, error: null })));
    render(<BookingWizard fields={fields} blocks={blocks} availability={[]} onlinePayment={{ enabled: true, environment: "sandbox" }} businessDate="2026-07-16" initialDate="2026-07-18" />);
    expect(screen.getByText(/sandbox checkout.*no real payment/i)).toBeVisible();
  });
});
