import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Drawer } from "../src/components/drawer";
import { FeedbackProvider, useFeedback } from "../src/providers/feedback";

afterEach(cleanup);

const OpenDrawerButton = () => {
  const { showItem } = useFeedback();

  return <button onClick={() => showItem("drag-drawer")}>Open drawer</button>;
};

const DrawerHarness = ({ onClose }: { onClose: () => void }) => {
  const { showItem, hideItem } = useFeedback();

  return (
    <>
      <button onClick={() => showItem("accessible-drawer")}>Open drawer</button>
      <Drawer
        id="accessible-drawer"
        aria-labelledby="accessible-drawer-title"
        onCloseDrawer={() => {
          onClose();
          hideItem("accessible-drawer");
        }}
      >
        <h2 id="accessible-drawer-title">Test drawer</h2>
        <button>Drawer action</button>
      </Drawer>
    </>
  );
};

const dispatchPointerEvent = (
  target: EventTarget,
  type: string,
  clientY: number,
) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    button: { value: 0 },
    clientX: { value: 20 },
    clientY: { value: clientY },
    isPrimary: { value: true },
    pointerId: { value: 1 },
  });
  act(() => target.dispatchEvent(event));
};

describe("Drawer drag behavior", () => {
  it("preserves the swipe-to-close gesture with the new useDrag hook", () => {
    const onCloseDrawer = vi.fn();
    const view = render(
      <FeedbackProvider>
        <OpenDrawerButton />
        <Drawer
          id="drag-drawer"
          onCloseDrawer={onCloseDrawer}
          handle={{ render: <span>Drag handle</span> }}
        />
      </FeedbackProvider>,
    );

    fireEvent.click(view.getByRole("button", { name: "Open drawer" }));

    const overlay = view.container.children[1] as HTMLElement;
    const drawer = overlay.firstElementChild as HTMLElement;
    const handle = view.getByText("Drag handle").parentElement as HTMLElement;
    vi.spyOn(drawer, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    dispatchPointerEvent(handle, "pointerdown", 10);
    dispatchPointerEvent(window, "pointermove", 100);

    expect(onCloseDrawer).toHaveBeenCalledOnce();

    dispatchPointerEvent(window, "pointerup", 100);
    expect(drawer.style.transform).toBe("translate3d(0px, 0px, 0)");
  });
});

describe("Drawer accessibility and dismissal", () => {
  it("closes with Escape and restores focus to the opener", () => {
    const onClose = vi.fn();

    render(
      <FeedbackProvider>
        <DrawerHarness onClose={onClose} />
      </FeedbackProvider>,
    );

    const opener = screen.getByRole("button", { name: "Open drawer" });
    opener.focus();
    fireEvent.click(opener);

    const dialog = screen.getByRole("dialog", { name: "Test drawer" });
    const action = screen.getByRole("button", { name: "Drawer action" });

    expect(document.activeElement).toBe(action);
    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it("closes from the backdrop but not from clicks inside the drawer", () => {
    const onClose = vi.fn();
    const { container } = render(
      <FeedbackProvider>
        <DrawerHarness onClose={onClose} />
      </FeedbackProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open drawer" }));

    fireEvent.click(screen.getByRole("button", { name: "Drawer action" }));
    expect(onClose).not.toHaveBeenCalled();

    const backdrop = container.querySelector('[role="dialog"]')?.parentElement;
    if (!backdrop) {
      throw new Error("Drawer backdrop was not rendered.");
    }

    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
