import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toast } from "../src/components/toast";
import { FeedbackProvider, useFeedback } from "../src/providers/feedback";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const ToastHarness = () => {
  const { isItemVisible, showItem, hideItem } = useFeedback();
  const [isMounted, setIsMounted] = useState(true);

  return (
    <>
      <button onClick={() => showItem("test-toast")}>Show toast</button>
      <button onClick={() => hideItem("test-toast")}>Hide toast</button>
      <button onClick={() => setIsMounted((mounted) => !mounted)}>
        Toggle toast component
      </button>
      {isMounted && (
        <Toast
          id="test-toast"
          durationInSeconds={3}
          style={{ background: "red" }}
          data-testid="toast"
        >
          Saved
        </Toast>
      )}
      <output data-testid="visible">
        {String(isItemVisible("test-toast"))}
      </output>
    </>
  );
};

describe("Toast", () => {
  it("announces content accessibly and auto-hides after its duration", () => {
    vi.useFakeTimers();
    render(
      <FeedbackProvider>
        <ToastHarness />
      </FeedbackProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));

    const toast = screen.getByTestId("toast");
    expect(toast.textContent).toBe("Saved");
    expect(toast.getAttribute("aria-live")).toBe("polite");
    expect(toast.getAttribute("aria-atomic")).toBe("true");
    expect((toast as HTMLDivElement).style.background).toBe("red");

    act(() => vi.advanceTimersByTime(2999));
    expect(screen.getByTestId("visible").textContent).toBe("true");

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId("visible").textContent).toBe("false");
    expect(screen.queryByTestId("toast")).toBeNull();
  });

  it("restarts the timer when hidden and shown again", () => {
    vi.useFakeTimers();
    render(
      <FeedbackProvider>
        <ToastHarness />
      </FeedbackProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    act(() => vi.advanceTimersByTime(2500));
    fireEvent.click(screen.getByRole("button", { name: "Hide toast" }));
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId("toast")).toBeTruthy();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByTestId("toast")).toBeNull();
  });

  it("clears the timer when the component unmounts", () => {
    vi.useFakeTimers();
    render(
      <FeedbackProvider>
        <ToastHarness />
      </FeedbackProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle toast component" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle toast component" }),
    );

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId("toast")).toBeTruthy();

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByTestId("toast")).toBeNull();
  });
});
