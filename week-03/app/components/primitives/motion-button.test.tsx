import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MotionButton } from "./motion-button";

describe("MotionButton", () => {
  it("renders the idle label and is not busy", () => {
    render(<MotionButton label="Send" />);
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveAttribute("data-state", "idle");
    expect(button).not.toHaveAttribute("aria-busy");
    expect(button).not.toBeDisabled();
  });

  it("is disabled when the disabled prop is set", () => {
    render(<MotionButton label="Send" disabled />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("marks loading as busy and disables interaction while loading", () => {
    render(<MotionButton label="Send" state="loading" loadingLabel="Sending…" />);
    const button = screen.getByRole("button", { name: "Sending…" });
    expect(button).toHaveAttribute("data-state", "loading");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });

  it("shows the success label and state in controlled mode", () => {
    render(<MotionButton label="Send" state="success" successLabel="Sent" />);
    const button = screen.getByRole("button", { name: "Sent" });
    expect(button).toHaveAttribute("data-state", "success");
    expect(button).not.toBeDisabled();
  });

  it("shows the error label and state in controlled mode", () => {
    render(<MotionButton label="Send" state="error" errorLabel="Retry" />);
    const button = screen.getByRole("button", { name: "Retry" });
    expect(button).toHaveAttribute("data-state", "error");
    expect(button).not.toBeDisabled();
  });

  it("drives the full async cycle on click", async () => {
    const user = userEvent.setup();
    const onAsyncClick = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    render(
      <MotionButton
        label="Deploy"
        loadingLabel="Deploying…"
        successLabel="Deployed"
        feedbackDuration={150}
        onAsyncClick={onAsyncClick}
      />,
    );

    const button = screen.getByRole("button", { name: "Deploy" });
    await user.click(button);

    expect(onAsyncClick).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("button", { name: "Deploying…" })).toHaveAttribute(
      "data-state",
      "loading",
    );

    const deployed = await screen.findByRole("button", { name: "Deployed" });
    expect(deployed).toHaveAttribute("data-state", "success");

    await screen.findByRole("button", { name: "Deploy" });
    expect(screen.getByRole("button", { name: "Deploy" })).toHaveAttribute(
      "data-state",
      "idle",
    );
  });

  it("surfaces async failures as the error state", async () => {
    const user = userEvent.setup();
    const onAsyncClick = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      throw new Error("boom");
    });
    render(
      <MotionButton
        label="Deploy"
        loadingLabel="Deploying…"
        errorLabel="Retry"
        onAsyncClick={onAsyncClick}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Deploy" }));
    expect(await screen.findByRole("button", { name: "Retry" })).toHaveAttribute(
      "data-state",
      "error",
    );
  });

  it("does not fire twice while loading (interruptible guard)", async () => {
    const user = userEvent.setup();
    const onAsyncClick = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    render(
      <MotionButton
        label="Deploy"
        loadingLabel="Deploying…"
        onAsyncClick={onAsyncClick}
      />,
    );

    const button = screen.getByRole("button", { name: "Deploy" });
    await user.click(button);
    await user.click(button);

    expect(onAsyncClick).toHaveBeenCalledTimes(1);
  });
});
