import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "../src/components/progressBar";

describe("ProgressBar", () => {
  it("exposes accessible progress values and supports native attributes and styles", () => {
    render(
      <ProgressBar
        aria-label="Upload progress"
        data-testid="upload-progress"
        percentage={65}
        style={{ width: "100%" }}
        barStyles={{ backgroundColor: "green" }}
      />,
    );

    const progressBar = screen.getByRole("progressbar", {
      name: "Upload progress",
    });
    const fill = progressBar.firstElementChild as HTMLDivElement;

    expect(progressBar.getAttribute("aria-valuemin")).toBe("0");
    expect(progressBar.getAttribute("aria-valuemax")).toBe("100");
    expect(progressBar.getAttribute("aria-valuenow")).toBe("65");
    expect(progressBar.getAttribute("data-testid")).toBe("upload-progress");
    expect((progressBar as HTMLDivElement).style.width).toBe("100%");
    expect(fill.style.width).toBe("65%");
    expect(fill.style.backgroundColor).toBe("green");
    expect(fill.getAttribute("aria-hidden")).toBe("true");
  });

  it("clamps the accessible value and fill width to the configured range", () => {
    render(
      <ProgressBar
        aria-label="Bounded progress"
        percentage={110}
        min={10}
        max={80}
      />,
    );

    const progressBar = screen.getByRole("progressbar", {
      name: "Bounded progress",
    });

    expect(progressBar.getAttribute("aria-valuemin")).toBe("10");
    expect(progressBar.getAttribute("aria-valuemax")).toBe("80");
    expect(progressBar.getAttribute("aria-valuenow")).toBe("80");
    expect((progressBar.firstElementChild as HTMLDivElement).style.width).toBe(
      "80%",
    );
  });
});
