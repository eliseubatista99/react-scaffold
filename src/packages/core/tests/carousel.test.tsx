import { act, cleanup, render, screen } from "@testing-library/react";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Carousel } from "../src/components/carousel";

vi.mock("react-slick", () => ({
  default: ({
    children,
    slidesToShow,
  }: React.PropsWithChildren<{ slidesToShow: number }>) => (
    <div data-testid="carousel-slider" data-slides-to-show={slidesToShow}>
      {children}
    </div>
  ),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Carousel", () => {
  it("supports native container attributes, style overrides, and slide styles", () => {
    render(
      <Carousel
        aria-label="Featured items"
        data-testid="carousel-container"
        style={{ padding: "8px" }}
        gap={12}
        content={[
          {
            id: "first",
            content: <span>First slide</span>,
            style: { backgroundColor: "red" },
          },
        ]}
      />,
    );

    const container = screen.getByTestId("carousel-container");
    const slide = screen.getByTestId("carousel-slide-item");

    expect(container.getAttribute("aria-label")).toBe("Featured items");
    expect((container as HTMLDivElement).style.padding).toBe("8px");
    expect((slide as HTMLDivElement).style.paddingRight).toBe("12px");
    expect((slide as HTMLDivElement).style.backgroundColor).toBe("red");
    expect(screen.getByText("First slide")).toBeTruthy();
  });

  it("updates the automatic visible slide count when the layout resizes", () => {
    let notifyResize: ResizeObserverCallback | undefined;
    const disconnect = vi.fn();

    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = callback;
      }

      observe = vi.fn();
      disconnect = disconnect;
      unobserve = vi.fn();
    }

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const { unmount } = render(
      <Carousel
        data-testid="carousel-container"
        content={[
          { id: "one", content: <span>One</span> },
          { id: "two", content: <span>Two</span> },
          { id: "three", content: <span>Three</span> },
          { id: "four", content: <span>Four</span> },
        ]}
      />,
    );

    const container = screen.getByTestId("carousel-container");
    const firstSlide = screen.getAllByTestId("carousel-slide-item")[0];
    if (!firstSlide) {
      throw new Error("Carousel did not render its first slide.");
    }

    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      width: 600,
    } as DOMRect);
    vi.spyOn(firstSlide, "getBoundingClientRect").mockReturnValue({
      width: 200,
    } as DOMRect);

    act(() => {
      notifyResize?.([], {} as ResizeObserver);
    });

    expect(screen.getByTestId("carousel-slider").getAttribute("data-slides-to-show")).toBe(
      "3",
    );

    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      width: 400,
    } as DOMRect);

    act(() => {
      notifyResize?.([], {} as ResizeObserver);
    });

    expect(screen.getByTestId("carousel-slider").getAttribute("data-slides-to-show")).toBe(
      "2",
    );

    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("normalizes explicit slide counts and omits the slider for empty content", () => {
    const { rerender } = render(
      <Carousel
        settings={{ slidesToShow: 0 }}
        content={[{ content: <span>Only slide</span> }]}
      />,
    );

    expect(screen.getByTestId("carousel-slider").getAttribute("data-slides-to-show")).toBe(
      "1",
    );

    rerender(<Carousel content={[]} />);

    expect(screen.queryByTestId("carousel-slider")).toBeNull();
  });

  it("recalculates the visible slide count on window resize without ResizeObserver", () => {
    vi.stubGlobal("ResizeObserver", undefined);

    render(
      <Carousel
        data-testid="carousel-container"
        content={[
          { content: <span>One</span> },
          { content: <span>Two</span> },
          { content: <span>Three</span> },
        ]}
      />,
    );

    const container = screen.getByTestId("carousel-container");
    const firstSlide = screen.getAllByTestId("carousel-slide-item")[0];
    if (!firstSlide) {
      throw new Error("Carousel did not render its first slide.");
    }

    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      width: 400,
    } as DOMRect);
    vi.spyOn(firstSlide, "getBoundingClientRect").mockReturnValue({
      width: 200,
    } as DOMRect);

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(screen.getByTestId("carousel-slider").getAttribute("data-slides-to-show")).toBe(
      "2",
    );
  });
});
