import { cleanup, render, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDidMount } from "../src/hooks/useDidMount";

afterEach(cleanup);

describe("useDidMount", () => {
  it("runs the callback after mounting and runs its cleanup on unmount", () => {
    const cleanupCallback = vi.fn();
    const callback = vi.fn(() => cleanupCallback);

    const { unmount } = renderHook(() => useDidMount(callback));

    expect(callback).toHaveBeenCalledOnce();
    expect(cleanupCallback).not.toHaveBeenCalled();

    unmount();

    expect(cleanupCallback).toHaveBeenCalledOnce();
  });

  it("runs the effect setup and cleanup cycle again in StrictMode", () => {
    const cleanupCallback = vi.fn();
    const callback = vi.fn(() => cleanupCallback);

    const { unmount } = render(
      <StrictMode>
        <EffectConsumer callback={callback} />
      </StrictMode>,
    );

    expect(callback).toHaveBeenCalledTimes(2);
    expect(cleanupCallback).toHaveBeenCalledOnce();

    unmount();

    expect(cleanupCallback).toHaveBeenCalledTimes(2);
  });
});

const EffectConsumer = ({ callback }: { callback: () => () => void }) => {
  useDidMount(callback);
  return null;
};
