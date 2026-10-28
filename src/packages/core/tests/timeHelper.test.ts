import { afterEach, describe, expect, it, vi } from "vitest";
import { TimeHelper } from "../src/helpers/timeHelper";

afterEach(() => {
  vi.useRealTimers();
});

describe("TimeHelper.waitForMilliseconds", () => {
  it("resolves after the requested delay", async () => {
    vi.useFakeTimers();
    const wait = TimeHelper.waitForMilliseconds(250);
    let resolved = false;
    void wait.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(249);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await expect(wait).resolves.toBeUndefined();
    expect(resolved).toBe(true);
  });
});

describe("TimeHelper.differenceInMonths", () => {
  it("returns the calendar month difference, ignoring the day", () => {
    expect(
      TimeHelper.differenceInMonths(
        new Date(2024, 0, 31),
        new Date(2024, 2, 1),
      ),
    ).toBe(2);
    expect(
      TimeHelper.differenceInMonths(
        new Date(2025, 0, 1),
        new Date(2024, 11, 1),
      ),
    ).toBe(-1);
  });
});

describe("TimeHelper.isSameDate", () => {
  it("compares local calendar dates and ignores time", () => {
    expect(
      TimeHelper.isSameDate(
        new Date(2025, 2, 10, 8),
        new Date(2025, 2, 10, 22),
      ),
    ).toBe(true);
    expect(
      TimeHelper.isSameDate(new Date(2025, 2, 10), new Date(2025, 2, 11)),
    ).toBe(false);
  });

  it("considers two missing dates equal", () => {
    expect(TimeHelper.isSameDate(undefined, undefined)).toBe(true);
  });
});

describe("TimeHelper UTC date methods", () => {
  const isoDate = "2025-03-10T12:34:56.000Z";

  it("returns UTC date parts with zero-based month and Sunday-based weekday", () => {
    expect(TimeHelper.getDateInUTC(isoDate)).toEqual({
      day: 10,
      month: 2,
      year: 2025,
      hour: 12,
      minute: 34,
      weekday: 1,
    });
  });

  it.each([undefined, null, "not-a-date"])(
    "returns undefined for missing or invalid date input",
    (date) => {
      expect(TimeHelper.getDateInUTC(date)).toBeUndefined();
    },
  );

  it("formats UTC dates with the requested format", () => {
    expect(TimeHelper.formatDateUTC(isoDate, "YYYY-MM-DD HH:mm")).toBe(
      "2025-03-10 12:34",
    );
  });

  it("formats UTC dates in the local timezone", () => {
    const date = new Date(isoDate);
    const expected = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    const expectedTime = [
      String(date.getHours()).padStart(2, "0"),
      String(date.getMinutes()).padStart(2, "0"),
    ].join(":");

    expect(
      TimeHelper.formatDateLocalTime(isoDate, "YYYY-MM-DD HH:mm"),
    ).toBe(`${expected} ${expectedTime}`);
  });

  it.each([undefined, null, "", "not-a-date"])(
    "returns an empty string when formatting missing or invalid input",
    (date) => {
      expect(TimeHelper.formatDateUTC(date)).toBe("");
      expect(TimeHelper.formatDateLocalTime(date)).toBe("");
    },
  );
});

describe("TimeHelper.isDateOneAfterDateTwo", () => {
  it("compares days within the same month instead of weekdays", () => {
    expect(
      TimeHelper.isDateOneAfterDateTwo(
        new Date(2025, 2, 10),
        new Date(2025, 2, 8),
      ),
    ).toBe(true);
  });

  it("compares dates across month and year boundaries", () => {
    expect(
      TimeHelper.isDateOneAfterDateTwo(
        new Date(2025, 2, 1),
        new Date(2025, 1, 28),
      ),
    ).toBe(true);
    expect(
      TimeHelper.isDateOneAfterDateTwo(
        new Date(2026, 0, 1),
        new Date(2025, 11, 31),
      ),
    ).toBe(true);
  });

  it("ignores time and returns false for the same or earlier calendar day", () => {
    expect(
      TimeHelper.isDateOneAfterDateTwo(
        new Date(2025, 2, 10, 23, 59),
        new Date(2025, 2, 10, 0, 0),
      ),
    ).toBe(false);
    expect(
      TimeHelper.isDateOneAfterDateTwo(
        new Date(2025, 2, 8),
        new Date(2025, 2, 10),
      ),
    ).toBe(false);
  });

  it("returns false for invalid dates", () => {
    expect(
      TimeHelper.isDateOneAfterDateTwo(new Date(Number.NaN), new Date()),
    ).toBe(false);
    expect(
      TimeHelper.isDateOneAfterDateTwo(new Date(), new Date(Number.NaN)),
    ).toBe(false);
  });
});
