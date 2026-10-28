import { act, cleanup, renderHook } from "@testing-library/react";
import { createElement, createRef, type RefObject } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useOnScreen } from "../src/hooks/useOnScreen";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useOnScreen", () => {
  it("renders on the server without an IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    const ServerComponent = () => {
      const ref = createRef<HTMLElement>();
      return createElement(
        "div",
        null,
        String(useOnScreen(ref)),
      );
    };

    expect(renderToString(createElement(ServerComponent))).toContain("false");
  });

  it("observes the current target and disconnects when the target changes", () => {
    const observerRecords: Array<{
      callback: IntersectionObserverCallback;
      observe: ReturnType<typeof vi.fn>;
      disconnect: ReturnType<typeof vi.fn>;
    }> = [];
    class IntersectionObserverMock {
      callback: IntersectionObserverCallback;
      observe = vi.fn();
      disconnect = vi.fn();

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        observerRecords.push(this);
      }
    }
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

    const firstTarget = document.createElement("div");
    const secondTarget = document.createElement("div");
    const ref = createRef<HTMLElement>();
    ref.current = firstTarget;

    const { result, rerender, unmount } = renderHook(
      ({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) =>
        useOnScreen(targetRef),
      { initialProps: { targetRef: ref } },
    );

    expect(observerRecords).toHaveLength(1);
    expect(observerRecords[0].observe).toHaveBeenCalledWith(firstTarget);

    act(() => {
      observerRecords[0].callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(result.current).toBe(true);

    ref.current = secondTarget;
    rerender({ targetRef: ref });

    expect(observerRecords[0].disconnect).toHaveBeenCalledOnce();
    expect(observerRecords).toHaveLength(2);
    expect(observerRecords[1].observe).toHaveBeenCalledWith(secondTarget);
    expect(result.current).toBe(false);

    unmount();
    expect(observerRecords[1].disconnect).toHaveBeenCalledOnce();
  });

  it("returns false when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const ref = createRef<HTMLElement>();
    ref.current = document.createElement("div");

    const { result } = renderHook(() => useOnScreen(ref));

    expect(result.current).toBe(false);
  });
});
