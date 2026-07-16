import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { mockPublicClient } from "@/lib/api/mock-client";

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
    const [fields, blocks, availability] = await Promise.all([
      mockPublicClient.getFields(),
      mockPublicClient.getBlocks(),
      mockPublicClient.getAvailability("2026-07-18"),
    ]);
    render(<BookingWizard fields={fields} blocks={blocks} availability={availability} apiOrigin="http://127.0.0.1:49999" businessDate="2026-07-16" initialDate="2026-07-18" />);

    expect(screen.getByRole("heading", { name: "Choose your date" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /choose field/i }));
    await user.click(screen.getByRole("button", { name: /armour field one/i }));
    await user.click(screen.getByRole("button", { name: /choose block/i }));
    await user.click(screen.getByRole("button", { name: /available.*field 01/i }));
    await user.click(screen.getByRole("button", { name: /add details/i }));

    expect(await screen.findByRole("heading", { name: "Who is booking?" })).toBeVisible();
    expect(screen.getByLabelText("Full name")).toBeRequired();
    expect(screen.getByLabelText("Email address")).toHaveAttribute("type", "email");
  });
});
