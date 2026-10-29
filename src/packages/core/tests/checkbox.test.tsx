import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "../src/components/checkbox";

describe("Checkbox", () => {
  it("associates the label with a controlled native checkbox", () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <Checkbox
        name="terms"
        checked={false}
        onToggle={onToggle}
        label="Accept terms"
        value="accepted"
      />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Accept terms",
    }) as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
    expect(checkbox.getAttribute("name")).toBe("terms");
    expect(checkbox.getAttribute("value")).toBe("accepted");

    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(true);

    rerender(
      <Checkbox
        name="terms"
        checked
        onToggle={onToggle}
        label="Accept terms"
        value="accepted"
      />,
    );

    expect(
      (
        screen.getByRole("checkbox", {
          name: "Accept terms",
        }) as HTMLInputElement
      ).checked,
    ).toBe(true);
  });

  it("supports native input attributes", () => {
    render(
      <Checkbox
        name="required-option"
        checked={false}
        onToggle={vi.fn()}
        label="Required option"
        required
        disabled
      />,
    );

    expect(
      (
        screen.getByRole("checkbox", {
          name: "Required option",
        }) as HTMLInputElement
      ).disabled,
    ).toBe(true);
  });
});
