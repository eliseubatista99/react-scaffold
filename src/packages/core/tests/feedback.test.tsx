import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
} from "@testing-library/react";
import { memo, type PropsWithChildren } from "react";
import { afterEach, describe, expect, it } from "vitest";
import {
  FeedbackProvider,
  useFeedback,
  useFeedbackActions,
} from "../src/providers/feedback";

afterEach(cleanup);

const createFeedbackWrapper = () =>
  ({ children }: PropsWithChildren) => (
    <FeedbackProvider>{children}</FeedbackProvider>
  );

describe("useFeedback", () => {
  it("throws when used outside a FeedbackProvider", () => {
    expect(() => renderHook(() => useFeedback())).toThrow(
      "useFeedback must be used within a FeedbackProvider.",
    );
    expect(() => renderHook(() => useFeedbackActions())).toThrow(
      "useFeedbackActions must be used within a FeedbackProvider.",
    );
  });

  it("reads and updates visible item IDs inside a FeedbackProvider", () => {
    const { result } = renderHook(() => useFeedback(), {
      wrapper: FeedbackProvider,
    });

    let isVisibleImmediatelyAfterShow = false;
    act(() => {
      result.current.showItem("example-modal");
      isVisibleImmediatelyAfterShow =
        result.current.isItemVisible("example-modal");
    });

    expect(result.current.visibleItems).toEqual(["example-modal"]);
    expect(isVisibleImmediatelyAfterShow).toBe(true);

    let isVisibleImmediatelyAfterHide = true;
    act(() => {
      result.current.hideItem("example-modal");
      isVisibleImmediatelyAfterHide =
        result.current.isItemVisible("example-modal");
    });

    expect(result.current.visibleItems).toEqual([]);
    expect(isVisibleImmediatelyAfterHide).toBe(false);
  });

  it("does not add duplicate IDs when showing the same item repeatedly", () => {
    const { result } = renderHook(() => useFeedback(), {
      wrapper: FeedbackProvider,
    });

    act(() => {
      result.current.showItem("example-modal");
      result.current.showItem("example-modal");
    });

    expect(result.current.visibleItems).toEqual(["example-modal"]);
    expect(result.current.isItemVisible("example-modal")).toBe(true);
  });

  it("keeps other items visible when hiding one item", () => {
    const { result } = renderHook(() => useFeedback(), {
      wrapper: FeedbackProvider,
    });

    act(() => {
      result.current.showItem("example-modal");
      result.current.showItem("example-toast");
    });

    expect(result.current.visibleItems).toEqual([
      "example-modal",
      "example-toast",
    ]);

    act(() => result.current.hideItem("example-modal"));

    expect(result.current.visibleItems).toEqual(["example-toast"]);
    expect(result.current.isItemVisible("example-modal")).toBe(false);
    expect(result.current.isItemVisible("example-toast")).toBe(true);
  });

  it("keeps visibility state isolated between providers", () => {
    const first = renderHook(() => useFeedback(), {
      wrapper: createFeedbackWrapper(),
    });
    const second = renderHook(() => useFeedback(), {
      wrapper: createFeedbackWrapper(),
    });

    act(() => first.result.current.showItem("first-provider-item"));

    expect(first.result.current.visibleItems).toEqual(["first-provider-item"]);
    expect(second.result.current.visibleItems).toEqual([]);
    expect(second.result.current.isItemVisible("first-provider-item")).toBe(
      false,
    );

    act(() => second.result.current.showItem("second-provider-item"));

    expect(first.result.current.visibleItems).toEqual(["first-provider-item"]);
    expect(second.result.current.visibleItems).toEqual(["second-provider-item"]);
  });

  it("does not rerender memoized consumers when the provider value is unchanged", () => {
    let renderCount = 0;
    const MemoizedConsumer = memo(() => {
      useFeedback();
      renderCount += 1;
      return null;
    });

    const { rerender } = render(
      <FeedbackProvider>
        <MemoizedConsumer />
      </FeedbackProvider>,
    );

    expect(renderCount).toBe(1);

    rerender(
      <FeedbackProvider>
        <MemoizedConsumer />
      </FeedbackProvider>,
    );

    expect(renderCount).toBe(1);
  });

  it("does not rerender action-only consumers when visibility changes", () => {
    let renderCount = 0;
    const MemoizedActionsConsumer = memo(() => {
      useFeedbackActions();
      renderCount += 1;
      return null;
    });
    const VisibilityControls = () => {
      const { showItem } = useFeedback();
      return (
        <button onClick={() => showItem("example-modal")}>Show modal</button>
      );
    };

    const { getByRole } = render(
      <FeedbackProvider>
        <MemoizedActionsConsumer />
        <VisibilityControls />
      </FeedbackProvider>,
    );

    expect(renderCount).toBe(1);

    fireEvent.click(getByRole("button", { name: "Show modal" }));

    expect(renderCount).toBe(1);
  });
});
