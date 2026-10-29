import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RadioButton } from "../src/components/radioButton";

describe("RadioButton", () => {
  it("renders a keyboard-operable button with an accessible pressed state", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <RadioButton
        checked={false}
        aria-label="Select option"
        onClick={onClick}
      />,
    );

    const radioButton = screen.getByRole("button", { name: "Select option" });

    expect(radioButton.tagName).toBe("BUTTON");
    expect(radioButton.getAttribute("type")).toBe("button");
    expect(radioButton.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(radioButton);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <RadioButton
        checked
        aria-label="Select option"
        onClick={onClick}
      />,
    );

    expect(
      screen
        .getByRole("button", { name: "Select option" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });
});
