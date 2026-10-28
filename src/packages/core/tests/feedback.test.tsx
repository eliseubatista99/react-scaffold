import { act, cleanup, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { FeedbackProvider, useFeedback } from "../src/providers/feedback";

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
});
