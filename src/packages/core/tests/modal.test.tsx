import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Modal } from "../src/components/modal";
import { FeedbackProvider, useFeedback } from "../src/providers/feedback";

afterEach(cleanup);

const ModalHarness = ({ onClose }: { onClose: () => void }) => {
  const { showItem, hideItem } = useFeedback();

  return (
    <>
      <button onClick={() => showItem("test-modal")}>Open modal</button>
      <Modal
        id="test-modal"
        aria-label="Test modal"
        onClickOutsideModal={() => {
          onClose();
          hideItem("test-modal");
        }}
      >
        <button>First action</button>
        <button>Last action</button>
      </Modal>
    </>
  );
};

describe("Modal", () => {
  it("exposes a named modal dialog, contains focus, closes with Escape, and restores focus", () => {
    const onClose = vi.fn();

    render(
      <FeedbackProvider>
        <ModalHarness onClose={onClose} />
      </FeedbackProvider>,
    );

    const opener = screen.getByRole("button", { name: "Open modal" });
    opener.focus();
    fireEvent.click(opener);

    const dialog = screen.getByRole("dialog", { name: "Test modal" });
    const firstAction = screen.getByRole("button", { name: "First action" });
    const lastAction = screen.getByRole("button", { name: "Last action" });

    expect(document.activeElement).toBe(firstAction);
    fireEvent.keyDown(lastAction, { key: "Tab" });
    expect(document.activeElement).toBe(firstAction);
    fireEvent.keyDown(firstAction, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(lastAction);

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it("calls the close callback for backdrop clicks but not dialog content", () => {
    const onClose = vi.fn();
    const { container } = render(
      <FeedbackProvider>
        <ModalHarness onClose={onClose} />
      </FeedbackProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open modal" }));
    const dialog = screen.getByRole("dialog", { name: "Test modal" });

    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();

    const backdrop = container.querySelector('[role="dialog"]')?.parentElement;
    if (!backdrop) {
      throw new Error("Modal backdrop was not rendered.");
    }

    act(() => fireEvent.click(backdrop));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
