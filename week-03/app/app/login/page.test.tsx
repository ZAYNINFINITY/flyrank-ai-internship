import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

describe("LoginPage", () => {
  it("renders labeled email and password fields", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("textbox", { name: "Email" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in" }),
    ).toBeInTheDocument();
  });

  it("shows a required error when submitting empty", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getAllByRole("alert")[0]).toHaveTextContent(
      "Email is required.",
    );
    expect(screen.getByLabelText("Password").parentElement).toHaveTextContent(
      "Password is required.",
    );
  });

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByRole("textbox", { name: "Email" }), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getAllByRole("alert")[0]).toHaveTextContent(
      "Enter a valid email address.",
    );
  });

  it("rejects a password shorter than 8 characters", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "zayn@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      screen.getByText("Password must be at least 8 characters."),
    ).toBeInTheDocument();
  });

  it("submits without errors when fields are valid", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "zayn@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Signing in…" }),
    ).toBeInTheDocument();
  });
});
