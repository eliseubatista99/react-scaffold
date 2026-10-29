import { afterEach, describe, expect, it, vi } from "vitest";
import { TimeHelper } from "../src/helpers/timeHelper";

afterEach(() => {
  vi.useRealTimers();
});

describe("TimeHelper condition waits", () => {
  it("resolves as soon as a synchronous condition is true", async () => {
    const condition = vi.fn(() => true);

    await expect(TimeHelper.waitForCondition(condition)).resolves.toBeUndefined();
    expect(condition).toHaveBeenCalledOnce();
  });

  it("polls synchronous conditions every 100 ms", async () => {
    vi.useFakeTimers();
    const condition = vi.fn().mockReturnValueOnce(false).mockReturnValue(true);
    const wait = TimeHelper.waitForCondition(condition);

    await vi.advanceTimersByTimeAsync(100);
    await expect(wait).resolves.toBeUndefined();
    expect(condition).toHaveBeenCalledTimes(2);
  });

  it("polls asynchronous conditions without overlapping checks", async () => {
    vi.useFakeTimers();
    const condition = vi
      .fn<() => Promise<boolean>>()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    const wait = TimeHelper.waitForAsyncCondition(condition);

    await vi.waitFor(() => expect(condition).toHaveBeenCalledOnce());
    await vi.advanceTimersByTimeAsync(100);
    await expect(wait).resolves.toBeUndefined();
    expect(condition).toHaveBeenCalledTimes(2);
  });

  it("rejects when the configured timeout expires", async () => {
    vi.useFakeTimers();
    const condition = vi.fn(() => false);
    const wait = TimeHelper.waitForCondition(condition, { timeoutMs: 250 });
    const rejection = expect(wait).rejects.toMatchObject({
      name: "TimeoutError",
    });

    await vi.advanceTimersByTimeAsync(250);
    await rejection;
    expect(condition).toHaveBeenCalledTimes(3);
  });

  it("rejects immediately when the signal is already aborted", async () => {
    const controller = new AbortController();
    const condition = vi.fn(() => true);
    controller.abort();

    await expect(
      TimeHelper.waitForCondition(condition, { signal: controller.signal }),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(condition).not.toHaveBeenCalled();
  });

  it("stops polling when the signal is aborted", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const condition = vi.fn(() => false);
    const wait = TimeHelper.waitForCondition(condition, {
      signal: controller.signal,
    });
    const rejection = expect(wait).rejects.toMatchObject({
      name: "AbortError",
    });

    controller.abort();
    await rejection;
    await vi.advanceTimersByTimeAsync(500);
    expect(condition).toHaveBeenCalledOnce();
  });

  it("propagates synchronous exceptions and asynchronous rejections", async () => {
    const error = new Error("condition failed");

    await expect(
      TimeHelper.waitForCondition(() => {
        throw error;
      }),
    ).rejects.toBe(error);
    await expect(
      TimeHelper.waitForAsyncCondition(() => Promise.reject(error)),
    ).rejects.toBe(error);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, 2_147_483_648])(
    "rejects invalid timeout %s",
    async (timeoutMs) => {
      await expect(
        TimeHelper.waitForCondition(() => false, { timeoutMs }),
      ).rejects.toBeInstanceOf(RangeError);
    },
  );
});
