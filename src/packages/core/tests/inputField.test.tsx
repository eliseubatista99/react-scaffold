import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InputField } from "../src/components/inputField";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("InputField", () => {
  it("associates the label and description and supports native attributes", () => {
    render(
      <InputField
        name="email"
        label="Email address"
        bottomMessage="Enter a valid email"
        placeholder="name@example.com"
        aria-describedby="email-hint"
        required
        style={{ maxWidth: "400px" }}
      />,
    );

    const input = screen.getByRole("textbox", {
      name: "Email address",
    }) as HTMLInputElement;

    expect(input.required).toBe(true);
    expect(input.placeholder).toBe("name@example.com");
    expect(input.getAttribute("aria-describedby")).toContain("email-hint");
    const descriptionId = input.getAttribute("aria-describedby")?.split(" ")[1];
    expect(descriptionId).toBeTruthy();
    if (descriptionId) {
      expect(document.getElementById(descriptionId)?.textContent).toBe(
        "Enter a valid email",
      );
    }
    expect(input.parentElement?.parentElement?.style.maxWidth).toBe("400px");
  });

  it("calls the click callback once when the input is clicked", () => {
    const onClick = vi.fn();

    render(<InputField name="search" onClick={onClick} />);

    fireEvent.click(screen.getByRole("textbox"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("cancels a pending debounced change when unmounted", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { unmount } = render(
      <InputField
        name="query"
        onChange={onChange}
        onChangeDelayInMilliseconds={100}
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "react" },
    });
    unmount();
    vi.advanceTimersByTime(100);

    expect(onChange).not.toHaveBeenCalled();
  });
});
