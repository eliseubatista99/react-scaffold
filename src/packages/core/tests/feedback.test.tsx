import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FeedbackProvider, useFeedback } from "../src/providers/feedback";

afterEach(cleanup);

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

    act(() => result.current.showItem("example-modal"));

    expect(result.current.visibleItems).toEqual(["example-modal"]);
    expect(result.current.isItemVisible("example-modal")).toBe(true);

    act(() => result.current.hideItem("example-modal"));

    expect(result.current.visibleItems).toEqual([]);
    expect(result.current.isItemVisible("example-modal")).toBe(false);
  });
});
