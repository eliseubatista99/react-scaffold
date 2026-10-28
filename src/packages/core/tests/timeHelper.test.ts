import { describe, expect, it } from "vitest";
import { TimeHelper } from "../src/helpers/timeHelper";

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
