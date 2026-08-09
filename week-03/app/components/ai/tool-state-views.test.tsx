import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolStateViews } from "./tool-state-views";

const basePart = { toolCallId: "call-1" };

describe("ToolStateViews", () => {
  it("renders the input-streaming state with a status label", () => {
    render(
      <ToolStateViews part={{ ...basePart, state: "input-streaming" }} />,
    );
    expect(screen.getByText(/asking the museum/i)).toBeInTheDocument();
  });

  it("renders input-available chips for string values", () => {
    render(
      <ToolStateViews
        part={{
          ...basePart,
          state: "input-available",
          input: { query: "infrastructure", collection: "infrastructure" },
        }}
      />,
    );
    expect(screen.getByText("query: infrastructure")).toBeInTheDocument();
    expect(
      screen.getByText("collection: infrastructure"),
    ).toBeInTheDocument();
  });

  it("delegates output-available rendering to the caller", () => {
    const renderOutput = vi.fn(() => <div>Custom result</div>);
    render(
      <ToolStateViews
        part={{ ...basePart, state: "output-available", output: { n: 1 } }}
        renderOutput={renderOutput}
      />,
    );
    expect(screen.getByText("Custom result")).toBeInTheDocument();
    expect(renderOutput).toHaveBeenCalledWith({ n: 1 });
  });

  it("renders a fallback result when output is available and no renderer is given", () => {
    render(
      <ToolStateViews
        part={{ ...basePart, state: "output-available", output: {} }}
      />,
    );
    expect(screen.getByText(/found what you asked/i)).toBeInTheDocument();
  });

  it("renders the output-error state as an alert", () => {
    render(
      <ToolStateViews
        part={{ ...basePart, state: "output-error", errorText: "rate limited" }}
      />,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/search failed/i);
    expect(alert).toHaveTextContent("rate limited");
  });

  it("renders nothing for an unknown state", () => {
    const { container } = render(
      <ToolStateViews
        part={{ ...basePart, state: "future-state" } as never}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
