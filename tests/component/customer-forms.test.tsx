import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SignInForm, SignUpForm } from "@/components/customer/customer-forms";

describe("customer account forms", () => {
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
});
