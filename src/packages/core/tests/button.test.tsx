import { fireEvent, render, screen } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../src/components/button";

describe("Button", () => {
  it("defaults to a non-submit button", () => {
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );

    render(
      <form onSubmit={onSubmit}>
        <Button onClick={() => undefined}>Action</Button>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Action" });

    expect(button.getAttribute("type")).toBe("button");
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("supports native button attributes and explicit submit behavior", () => {
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );
    const onClick = vi.fn();

    render(
      <form onSubmit={onSubmit}>
        <Button
          type="submit"
          onClick={onClick}
          aria-label="Save changes"
          className="save-button"
          style={{ color: "red", padding: "8px" }}
        >
          Save
        </Button>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Save changes" });

    expect(button.getAttribute("type")).toBe("submit");
    expect(button.classList.contains("save-button")).toBe(true);
    expect(button.style.color).toBe("red");
    expect(button.style.padding).toBe("8px");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
