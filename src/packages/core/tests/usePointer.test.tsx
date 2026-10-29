import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePointer } from "../src/hooks/usePointer";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const dispatchPointerEvent = (
  type: string,
  {
    clientX = 0,
    clientY = 0,
    isPrimary = true,
    pointerId = 1,
  }: {
    clientX?: number;
    clientY?: number;
    isPrimary?: boolean;
    pointerId?: number;
  } = {},
) => {
  const event = new Event(type);
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: clientY },
    isPrimary: { value: isPrimary },
    pointerId: { value: pointerId },
  });
  act(() => window.dispatchEvent(event));
};

describe("usePointer", () => {
  it("updates coordinates only for primary pointer movement", () => {
    const { result } = renderHook(() => usePointer());

    dispatchPointerEvent("pointermove", {
      clientX: 20,
      clientY: 30,
      isPrimary: false,
      pointerId: 2,
    });
    expect(result.current.pointerPosition).toEqual({});

    dispatchPointerEvent("pointermove", {
      clientX: 20,
      clientY: 30,
      pointerId: 1,
    });
    expect(result.current.pointerPosition).toEqual({ x: 20, y: 30 });
  });

  it("tracks the active primary pointer and ignores other pointer IDs", () => {
    const { result } = renderHook(() => usePointer());

    dispatchPointerEvent("pointerdown", { pointerId: 1 });
    expect(result.current.isPointerDown).toBe(true);

    dispatchPointerEvent("pointerdown", { pointerId: 2, isPrimary: false });
    dispatchPointerEvent("pointerup", { pointerId: 2, isPrimary: false });
    expect(result.current.isPointerDown).toBe(true);

    dispatchPointerEvent("pointerup", { pointerId: 1 });
    expect(result.current.isPointerDown).toBe(false);
  });

  it("resets the pressed state when the active pointer is cancelled", () => {
    const { result } = renderHook(() => usePointer());

    dispatchPointerEvent("pointerdown", { pointerId: 7 });
    dispatchPointerEvent("pointercancel", { pointerId: 7 });

    expect(result.current.isPointerDown).toBe(false);
  });

  it("removes all global listeners when unmounted", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => usePointer());

    unmount();

    expect(removeEventListener.mock.calls.map(([type]) => type)).toEqual([
      "pointermove",
      "pointerdown",
      "pointerup",
      "pointercancel",
    ]);
  });

  it("keeps the same position object when coordinates have not changed", () => {
    const { result } = renderHook(() => usePointer());

    dispatchPointerEvent("pointermove", { clientX: 10, clientY: 15 });
    const firstPosition = result.current.pointerPosition;

    dispatchPointerEvent("pointermove", { clientX: 10, clientY: 15 });

    expect(result.current.pointerPosition).toBe(firstPosition);
  });
});
