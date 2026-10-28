import { describe, expect, it } from "vitest";
import { NumberHelper } from "../src/helpers/numberHelper";

describe("NumberHelper.clamp", () => {
  it("returns the number when it is within the bounds", () => {
    expect(NumberHelper.clamp(5, 0, 10)).toBe(5);
  });

  it("clamps numbers below or above the bounds", () => {
    expect(NumberHelper.clamp(-1, 0, 10)).toBe(0);
    expect(NumberHelper.clamp(11, 0, 10)).toBe(10);
  });

  it("supports values equal to the bounds and equal bounds", () => {
    expect(NumberHelper.clamp(0, 0, 10)).toBe(0);
    expect(NumberHelper.clamp(10, 0, 10)).toBe(10);
    expect(NumberHelper.clamp(5, 5, 5)).toBe(5);
  });

  it("rejects inverted bounds", () => {
    expect(() => NumberHelper.clamp(5, 10, 0)).toThrow(RangeError);
  });

  it.each([
    [Number.NaN, 0, 10],
    [5, Number.NaN, 10],
    [5, 0, Number.NaN],
    [Number.POSITIVE_INFINITY, 0, 10],
    [5, Number.NEGATIVE_INFINITY, 10],
    [5, 0, Number.POSITIVE_INFINITY],
  ])("rejects non-finite arguments", (num, min, max) => {
    expect(() => NumberHelper.clamp(num, min, max)).toThrow(RangeError);
  });
});
