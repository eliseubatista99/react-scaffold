import { act, cleanup, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useResponsive } from "../src/hooks/useResponsive";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: height,
  });
};

describe("useResponsive", () => {
  it("renders safely without window and uses a consistent server snapshot", () => {
    vi.stubGlobal("window", undefined);

    const ServerComponent = () => {
      const { currentWidth, currentHeight, currentBreakpoint, currentSize } =
        useResponsive();

      return createElement(
        "output",
        null,
        `${currentWidth},${currentHeight},${currentBreakpoint},${currentSize}`,
      );
    };

    expect(renderToString(createElement(ServerComponent))).toContain(
      "0,0,xs,mobile",
    );
  });

  it("merges partial breakpoint overrides with defaults", () => {
    setViewport(500, 800);

    const { result } = renderHook(() =>
      useResponsive({ breakpointConfiguration: { sm: 600 } }),
    );

    expect(result.current).toEqual({
      currentWidth: 500,
      currentHeight: 800,
      currentBreakpoint: "xs",
      currentSize: "mobile",
    });
  });

  it("updates the output when breakpoint configuration changes", () => {
    setViewport(500, 800);

    const { result, rerender } = renderHook(
      ({ sm }: { sm: number }) =>
        useResponsive({ breakpointConfiguration: { sm } }),
      { initialProps: { sm: 600 } },
    );

    expect(result.current.currentBreakpoint).toBe("xs");
    expect(result.current.currentSize).toBe("mobile");

    rerender({ sm: 300 });

    expect(result.current.currentBreakpoint).toBe("sm");
    expect(result.current.currentSize).toBe("tablet");
  });

  it("updates width, height, breakpoint, and size on resize", () => {
    setViewport(400, 700);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.currentBreakpoint).toBe("xs");
    expect(result.current.currentSize).toBe("mobile");

    setViewport(1024, 900);
    act(() => window.dispatchEvent(new Event("resize")));

    expect(result.current).toEqual({
      currentWidth: 1024,
      currentHeight: 900,
      currentBreakpoint: "lg",
      currentSize: "desktop",
    });
  });

  it.each([
    { width: 419, breakpoint: "xs", size: "mobile" },
    { width: 420, breakpoint: "sm", size: "tablet" },
    { width: 767, breakpoint: "sm", size: "tablet" },
    { width: 768, breakpoint: "md", size: "tablet" },
    { width: 990, breakpoint: "md", size: "tablet" },
    { width: 991, breakpoint: "lg", size: "desktop" },
  ] as const)(
    "aligns size and breakpoint at width $width",
    ({ width, breakpoint, size }) => {
      setViewport(width, 600);

      const { result } = renderHook(() => useResponsive());

      expect(result.current.currentBreakpoint).toBe(breakpoint);
      expect(result.current.currentSize).toBe(size);
    },
  );

  it("uses configured sm and lg thresholds for the size", () => {
    setViewport(500, 600);

    const { result } = renderHook(() =>
      useResponsive({
        breakpointConfiguration: { sm: 450, lg: 550 },
      }),
    );

    expect(result.current.currentBreakpoint).toBe("sm");
    expect(result.current.currentSize).toBe("tablet");
  });
});
