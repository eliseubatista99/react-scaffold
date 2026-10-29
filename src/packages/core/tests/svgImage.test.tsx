import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SvgImage } from "../src/components/svgImage";

afterEach(cleanup);

describe("SvgImage", () => {
  it("exposes the SVG as an image with an accessible name", () => {
    const { container } = render(
      <SvgImage
        src={<path d="M0 0h10v10H0z" />}
        alt="Square icon"
        className="square-icon"
        width="32"
        style={{ color: "red" }}
      />,
    );
    const svg = container.querySelector("svg");

    expect(screen.getByRole("img", { name: "Square icon" })).toBe(svg);
    expect(svg?.classList.contains("square-icon")).toBe(true);
    expect(svg?.getAttribute("width")).toBe("32");
    expect(svg?.style.color).toBe("red");
    expect(svg?.querySelector("path")?.getAttribute("d")).toBe(
      "M0 0h10v10H0z",
    );
  });

  it("hides decorative SVGs and supports keyboard activation when clickable", () => {
    const onClick = vi.fn();
    const { container, rerender } = render(
      <SvgImage src={<path d="M0 0h1v1H0z" />} />,
    );

    expect(
      container.querySelector("svg")?.getAttribute("aria-hidden"),
    ).toBe("true");

    rerender(
      <SvgImage
        src={<path d="M0 0h1v1H0z" />}
        alt="Toggle icon"
        onClick={onClick}
      />,
    );

    const svg = screen.getByRole("button", { name: "Toggle icon" });

    expect(svg.getAttribute("tabindex")).toBe("0");
    fireEvent.keyDown(svg, { key: "Enter" });
    fireEvent.keyDown(svg, { key: " " });

    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
