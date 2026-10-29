import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NumericInputField } from "../src/components/numericInputField";

afterEach(cleanup);

describe("NumericInputField", () => {
  it("removes invalid characters, keeps one sign and decimal point, and caps decimals", () => {
    const onInput = vi.fn();
    const onChange = vi.fn();

    render(
      <NumericInputField
        name="amount"
        allowNegatives
        allowDecimals
        decimalScale={2}
        onInput={onInput}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "a-1.234.5" } });

    expect(input.value).toBe("-1.23");
    expect(onInput).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("-1.23");
    expect(input.getAttribute("pattern")).toBe(
      "^-?(?:[0-9]+(?:\\.[0-9]{0,2})?|\\.[0-9]{1,2})$",
    );
    expect(input.getAttribute("inputmode")).toBe("decimal");
  });

  it("supports entering a leading decimal and disabling decimals and negatives", () => {
    const { rerender } = render(
      <NumericInputField
        name="amount"
        allowNegatives
        allowDecimals
        decimalScale={3}
      />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.input(input, { target: { value: ".5" } });
    expect(input.value).toBe("0.5");

    rerender(
      <NumericInputField
        name="amount"
        allowNegatives={false}
        allowDecimals={false}
      />,
    );
    fireEvent.input(input, { target: { value: "-1.5" } });

    expect(input.value).toBe("15");
    expect(input.getAttribute("pattern")).toBe("^[0-9]+$");
    expect(input.getAttribute("inputmode")).toBe("numeric");
  });

  it("preserves the current min and max rejection behavior", () => {
    render(
      <NumericInputField
        name="amount"
        value="5"
        min={0}
        max={10}
        onChange={() => undefined}
      />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "15" } });

    expect(input.value).toBe("5");
  });

  it("uses maxLength as a fallback maximum and preserves consumer input handlers", () => {
    const onInput = vi.fn();

    render(
      <NumericInputField
        name="amount"
        initialValue="99"
        maxLength={2}
        onInput={onInput}
      />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "100" } });

    expect(input.value).toBe("99");
    expect(onInput).toHaveBeenCalledOnce();
  });
});
