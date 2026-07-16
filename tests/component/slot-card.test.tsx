import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SlotCard } from "@/components/booking/slot-card";
import { blocks } from "@/lib/content";

describe("SlotCard", () => {
  it("allows an available slot to be selected", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SlotCard
        block={blocks[0]}
        fieldName="Field 01"
        status="available"
        onSelect={onSelect}
      />,
    );
    const button = screen.getByRole("button", { name: /available.*field 01/i });
    await user.click(button);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("keeps a held slot visible and disabled", () => {
    render(
      <SlotCard
        block={blocks[1]}
        fieldName="Field 02"
        status="held"
        onSelect={() => undefined}
      />,
    );
    expect(screen.getByRole("button", { name: /on hold.*field 02/i })).toBeDisabled();
    expect(screen.getByText("Temporarily held by another booking")).toBeVisible();
  });
});
