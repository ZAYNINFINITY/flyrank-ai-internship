import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectCostingSettings from "./ProjectCostingSettings.jsx";

describe("ProjectCostingSettings", () => {
  it("submits successfully with valid data", async () => {
    const onSave = vi.fn();
    render(<ProjectCostingSettings onSave={onSave} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/company name/i), "Acme Contractors");
    await user.type(screen.getByLabelText(/tax rate/i), "15");
    await user.selectOptions(screen.getByLabelText(/default currency/i), "USD");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: "Acme Contractors",
        taxRate: 15,
        defaultCurrency: "USD",
      })
    );
  });

  it("blocks submit and shows an error when a required field is empty", async () => {
    const onSave = vi.fn();
    render(<ProjectCostingSettings onSave={onSave} />);
    const user = userEvent.setup();

    // Leave companyName and taxRate empty, just click save
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/company name must be at least/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("rejects a tax rate outside 0-100", async () => {
    const onSave = vi.fn();
    render(<ProjectCostingSettings onSave={onSave} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/company name/i), "Acme Contractors");
    await user.type(screen.getByLabelText(/tax rate/i), "150");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/cannot exceed 100/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("rejects an invalid currency value", async () => {
    const onSave = vi.fn();
    const { container } = render(<ProjectCostingSettings onSave={onSave} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/company name/i), "Acme Contractors");
    await user.type(screen.getByLabelText(/tax rate/i), "15");

    // Force an invalid value directly to simulate a bad/injected value,
    // since the <select> only exposes valid options in normal use
    const select = container.querySelector("#defaultCurrency");
    const invalidOption = document.createElement("option");
    invalidOption.value = "XYZ";
    invalidOption.textContent = "XYZ";
    select.appendChild(invalidOption);
    await user.selectOptions(select, "XYZ");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/select a valid currency/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
