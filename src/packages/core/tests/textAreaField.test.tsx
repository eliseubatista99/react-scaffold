import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextAreaField } from "../src/components/textAreaField";

afterEach(cleanup);

describe("TextAreaField", () => {
  it("associates the label and description and forwards native textarea attributes", () => {
    render(
      <TextAreaField
        name="message"
        id="message-field"
        label="Message"
        placeholder="Write a message"
        rows={4}
        maxLength={200}
        required
        disabled
        aria-describedby="existing-description"
        bottomMessage="Required field"
        data-testid="message-input"
        style={{ maxWidth: "500px" }}
      />,
    );

    const textarea = screen.getByLabelText("Message") as HTMLTextAreaElement;

    expect(textarea.id).toBe("message-field");
    expect(textarea.placeholder).toBe("Write a message");
    expect(textarea.rows).toBe(4);
    expect(textarea.maxLength).toBe(200);
    expect(textarea.required).toBe(true);
    expect(textarea.disabled).toBe(true);
    expect(textarea.getAttribute("aria-describedby")).toBe(
      "existing-description message-field-description",
    );
    expect(textarea.getAttribute("data-testid")).toBe("message-input");
  });

  it("calls value and native focus callbacks and supports controlled values", () => {
    const onChange = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    const { rerender } = render(
      <TextAreaField
        name="message"
        label="Message"
        value="Initial"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />,
    );

    const textarea = screen.getByLabelText("Message") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Updated" } });
    fireEvent.focus(textarea);
    fireEvent.blur(textarea);

    expect(onChange).toHaveBeenCalledWith("Updated");
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onFocus.mock.calls[0][0].type).toBe("focus");
    expect(onBlur).toHaveBeenCalledOnce();
    expect(onBlur.mock.calls[0][0].type).toBe("blur");

    rerender(
      <TextAreaField
        name="message"
        label="Message"
        value="Controlled update"
        onChange={onChange}
      />,
    );

    expect(textarea.value).toBe("Controlled update");
  });

  it("uses initialValue only for uncontrolled textareas", () => {
    render(
      <TextAreaField
        name="message"
        label="Message"
        initialValue="Uncontrolled value"
      />,
    );

    expect(
      (screen.getByLabelText("Message") as HTMLTextAreaElement).value,
    ).toBe("Uncontrolled value");
  });
});
