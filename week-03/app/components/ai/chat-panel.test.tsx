import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUseChat = vi.fn();

vi.mock("@ai-sdk/react", () => ({
  useChat: (...args: unknown[]) => mockUseChat(...args),
}));

vi.mock("ai", () => ({
  DefaultChatTransport: class DefaultChatTransport {
    api: string;
    constructor(opts: { api: string }) {
      this.api = opts.api;
    }
  },
  isTextUIPart: (part: { type: string }) => part.type === "text",
  isToolUIPart: (part: { type: string }) => part.type === "tool",
}));

import { ChatPanel } from "./chat-panel";

function baseMock(overrides: Record<string, unknown> = {}) {
  return {
    messages: [],
    sendMessage: vi.fn(),
    stop: vi.fn(),
    regenerate: vi.fn(),
    clearError: vi.fn(),
    status: "ready",
    error: undefined,
    ...overrides,
  };
}

describe("ChatPanel", () => {
  it("renders the empty state with example prompts", () => {
    mockUseChat.mockReturnValue(baseMock());
    render(<ChatPanel heading="Assistant" />);
    expect(screen.getByText("Assistant")).toBeInTheDocument();
    expect(screen.getByText(/no conversations yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /type a message/i }),
    ).toBeInTheDocument();
  });

  it("disables send while loading (pending state)", () => {
    mockUseChat.mockReturnValue(
      baseMock({ status: "submitted", messages: [] }),
    );
    render(<ChatPanel />);
    const input = screen.getByRole("textbox", { name: /type a message/i });
    expect(input).toBeDisabled();
  });

  it("switches to a stop control while streaming", () => {
    mockUseChat.mockReturnValue(
      baseMock({
        status: "streaming",
        messages: [
          {
            id: "u1",
            role: "user",
            parts: [{ type: "text", text: "hello" }],
          },
        ],
      }),
    );
    render(<ChatPanel />);
    expect(
      screen.getByRole("button", { name: "Stop generating" }),
    ).toBeInTheDocument();
  });

  it("renders the error banner with retry on error state", () => {
    mockUseChat.mockReturnValue(
      baseMock({
        status: "error",
        error: new Error("network down"),
      }),
    );
    render(<ChatPanel />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      /connection to the assistant failed/i,
    );
    expect(
      screen.getByRole("button", { name: /retry/i }),
    ).toBeInTheDocument();
  });

  it("renders a user message and an assistant text reply", () => {
    mockUseChat.mockReturnValue(
      baseMock({
        messages: [
          { id: "u1", role: "user", parts: [{ type: "text", text: "hello" }] },
          {
            id: "a1",
            role: "assistant",
            parts: [{ type: "text", text: "the museum is open" }],
          },
        ],
      }),
    );
    render(<ChatPanel />);
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("the museum is open")).toBeInTheDocument();
  });

  it("submits the typed message on send", async () => {
    const user = userEvent.setup();
    const sendMessage = vi.fn();
    mockUseChat.mockReturnValue(baseMock({ sendMessage }));
    render(<ChatPanel />);

    await user.type(
      screen.getByRole("textbox", { name: /type a message/i }),
      "show me exhibits",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(sendMessage).toHaveBeenCalledWith({ text: "show me exhibits" });
  });
});
