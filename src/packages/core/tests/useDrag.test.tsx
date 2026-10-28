import { act, cleanup, render } from "@testing-library/react";
import { useCallback } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  useDrag,
  type UseDragInput,
  type UseDragOutput,
} from "../src/hooks/useDrag";

afterEach(cleanup);

const rect = (left: number, top: number, width: number, height: number) =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect;

interface DragFixtureGeometry {
  containerRect?: DOMRect;
  targetRect?: DOMRect;
  clientLeft?: number;
  clientTop?: number;
  clientWidth?: number;
  clientHeight?: number;
  scrollLeft?: number;
  scrollTop?: number;
}

const createDragFixture = (
  options: UseDragInput = {},
  geometry: DragFixtureGeometry = {},
) => {
  let drag: UseDragOutput;

  const TestComponent = () => {
    drag = useDrag(options);
    const assignContainerRef = useCallback(
      (node: HTMLElement | null) => {
        if (node) {
          vi.spyOn(node, "getBoundingClientRect").mockReturnValue(
            geometry.containerRect ?? rect(0, 0, 100, 100),
          );
          Object.defineProperties(node, {
            clientLeft: { configurable: true, value: geometry.clientLeft ?? 0 },
            clientTop: { configurable: true, value: geometry.clientTop ?? 0 },
            clientWidth: {
              configurable: true,
              value: geometry.clientWidth ?? 100,
            },
            clientHeight: {
              configurable: true,
              value: geometry.clientHeight ?? 100,
            },
            scrollLeft: {
              configurable: true,
              value: geometry.scrollLeft ?? 0,
            },
            scrollTop: {
              configurable: true,
              value: geometry.scrollTop ?? 0,
            },
          });
        }
        drag.containerRef(node);
      },
      [drag.containerRef],
    );
    const assignTargetRef = useCallback(
      (node: HTMLElement | null) => {
        if (node) {
          vi.spyOn(node, "getBoundingClientRect").mockReturnValue(
            geometry.targetRect ?? rect(20, 30, 40, 40),
          );
        }
        drag.ref(node);
      },
      [drag.ref],
    );

    return (
      <section ref={assignContainerRef} data-testid="container">
        <article ref={assignTargetRef} style={drag.style} data-testid="target" />
      </section>
    );
  };

  const view = render(<TestComponent />);
  const target = view.getByTestId("target");

  return {
    ...view,
    target,
    getDrag: () => drag,
  };
};

const dispatchPointerEvent = (
  target: EventTarget,
  type: string,
  {
    clientX = 0,
    clientY = 0,
    isPrimary = true,
    pointerId = 1,
  } = {},
) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    button: { value: 0 },
    clientX: { value: clientX },
    clientY: { value: clientY },
    isPrimary: { value: isPrimary },
    pointerId: { value: pointerId },
  });
  act(() => target.dispatchEvent(event));
};

describe("useDrag", () => {
  it("follows the pointer and keeps the element within its container", () => {
    const onDrag = vi.fn();
    const { target, getDrag } = createDragFixture({ onDrag });

    expect(getDrag().position).toEqual({ x: 20, y: 30 });

    dispatchPointerEvent(target, "pointerdown", { clientX: 30, clientY: 40 });
    dispatchPointerEvent(window, "pointermove", {
      clientX: 110,
      clientY: 120,
    });

    expect(getDrag().position).toEqual({ x: 60, y: 60 });
    expect(getDrag().isDragging).toBe(true);
    expect(target.style.transform).toBe("translate3d(40px, 30px, 0)");
    expect(onDrag).toHaveBeenLastCalledWith({
      position: { x: 60, y: 60 },
      delta: { x: 40, y: 30 },
      isDragging: true,
    });

    dispatchPointerEvent(window, "pointerup", {
      clientX: 110,
      clientY: 120,
    });
    expect(getDrag().isDragging).toBe(false);
  });

  it("calculates bounds from the container's inner area and current scroll offset", () => {
    const { target, getDrag } = createDragFixture(
      {},
      {
        containerRect: rect(100, 200, 200, 200),
        targetRect: rect(150, 250, 40, 40),
        clientLeft: 10,
        clientTop: 8,
        clientWidth: 180,
        clientHeight: 170,
        scrollLeft: 25,
        scrollTop: 15,
      },
    );

    expect(getDrag().position).toEqual({ x: 65, y: 57 });

    dispatchPointerEvent(target, "pointerdown", {
      clientX: 160,
      clientY: 260,
    });
    dispatchPointerEvent(window, "pointermove", {
      clientX: 500,
      clientY: 600,
    });

    expect(getDrag().position).toEqual({ x: 165, y: 145 });

    dispatchPointerEvent(window, "pointerup", {
      clientX: 500,
      clientY: 600,
    });
    dispatchPointerEvent(target, "pointerdown", {
      clientX: 160,
      clientY: 260,
    });
    dispatchPointerEvent(window, "pointermove", {
      clientX: -1000,
      clientY: -1000,
    });

    expect(getDrag().position).toEqual({ x: 25, y: 15 });
  });

  it("can restrict movement to one axis and disable container bounds", () => {
    const { target, getDrag } = createDragFixture({
      axis: "y",
      bounds: false,
    });

    dispatchPointerEvent(target, "pointerdown", { clientX: 30, clientY: 40 });
    dispatchPointerEvent(window, "pointermove", {
      clientX: 90,
      clientY: 150,
    });

    expect(getDrag().position).toEqual({ x: 20, y: 140 });
    expect(target.style.transform).toBe("translate3d(0px, 110px, 0)");
  });

  it("can reset the visual position when dragging ends", () => {
    const { target } = createDragFixture({ resetOnDragEnd: true });

    dispatchPointerEvent(target, "pointerdown", { clientX: 30, clientY: 40 });
    dispatchPointerEvent(window, "pointermove", {
      clientX: 40,
      clientY: 50,
    });
    dispatchPointerEvent(window, "pointerup", {
      clientX: 40,
      clientY: 50,
    });

    expect(target.style.transform).toBe("translate3d(0px, 0px, 0)");
  });

  it("can use a separate handle to move the target", () => {
    let drag: UseDragOutput;
    const TestComponent = () => {
      drag = useDrag();
      const setContainer = useCallback(
        (node: HTMLElement | null) => {
          if (node) {
            vi.spyOn(node, "getBoundingClientRect").mockReturnValue(
              rect(0, 0, 100, 100),
            );
            Object.defineProperties(node, {
              clientWidth: { configurable: true, value: 100 },
              clientHeight: { configurable: true, value: 100 },
            });
          }
          drag.containerRef(node);
        },
        [drag.containerRef],
      );
      const setTarget = useCallback(
        (node: HTMLElement | null) => {
          if (node) {
            vi.spyOn(node, "getBoundingClientRect").mockReturnValue(
              rect(20, 30, 40, 40),
            );
          }
          drag.ref(node);
        },
        [drag.ref],
      );

      return (
        <section ref={setContainer}>
          <article ref={setTarget} data-testid="target">
            <button ref={drag.handleRef} data-testid="handle" />
          </article>
        </section>
      );
    };
    const view = render(<TestComponent />);
    const target = view.getByTestId("target");
    const handle = view.getByTestId("handle");

    dispatchPointerEvent(target, "pointerdown", { clientX: 30, clientY: 40 });
    expect(drag.isDragging).toBe(false);

    dispatchPointerEvent(handle, "pointerdown", { clientX: 30, clientY: 40 });
    dispatchPointerEvent(window, "pointermove", {
      clientX: 40,
      clientY: 50,
    });

    expect(drag.position).toEqual({ x: 30, y: 40 });
  });

  it("ignores non-primary pointers and ends when the active pointer is cancelled", () => {
    const onDragEnd = vi.fn();
    const { target, getDrag } = createDragFixture({ onDragEnd });

    dispatchPointerEvent(target, "pointerdown", {
      clientX: 30,
      clientY: 40,
      isPrimary: false,
      pointerId: 2,
    });
    expect(getDrag().isDragging).toBe(false);

    dispatchPointerEvent(target, "pointerdown", {
      clientX: 30,
      clientY: 40,
      pointerId: 1,
    });
    dispatchPointerEvent(window, "pointercancel", {
      clientX: 30,
      clientY: 40,
      pointerId: 1,
    });

    expect(getDrag().isDragging).toBe(false);
    expect(onDragEnd).toHaveBeenCalledWith({
      position: { x: 20, y: 30 },
      delta: { x: 0, y: 0 },
      isDragging: false,
    });
  });

  it("restores the handle touch action when the target unmounts", () => {
    let target: HTMLElement | null = null;
    const TestComponent = () => {
      const drag = useDrag();

      return (
        <section ref={drag.containerRef}>
          <article
            ref={(node) => {
              if (node) {
                target = node;
                node.style.touchAction = "pan-y";
              }
              drag.ref(node);
            }}
            style={drag.style}
          />
        </section>
      );
    };
    const { unmount } = render(<TestComponent />);

    unmount();

    expect(target?.style.touchAction).toBe("pan-y");
  });
});
