import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Image } from "../src/components/image";

afterEach(cleanup);

describe("Image", () => {
  it("supports native image attributes and styles", () => {
    render(
      <Image
        src="/image.png"
        alt="Scenic mountain"
        loading="lazy"
        className="scenic-image"
        style={{ objectFit: "contain" }}
      />,
    );

    const image = screen.getByRole("img", { name: "Scenic mountain" });

    expect(image.getAttribute("loading")).toBe("lazy");
    expect(image.classList.contains("scenic-image")).toBe(true);
    expect((image as HTMLImageElement).style.objectFit).toBe("contain");
  });

  it("supports keyboard activation when clickable", () => {
    const onClick = vi.fn();

    render(
      <Image src="/image.png" alt="Open image" onClick={onClick} />,
    );

    const image = screen.getByRole("button", { name: "Open image" });

    expect(image.getAttribute("tabindex")).toBe("0");
    fireEvent.keyDown(image, { key: "Enter" });
    fireEvent.keyDown(image, { key: " " });

    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
