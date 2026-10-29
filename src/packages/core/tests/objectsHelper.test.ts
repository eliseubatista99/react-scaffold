import { describe, expect, it } from "vitest";
import { ObjectsHelper } from "../src/helpers/objectsHelper";

describe("ObjectsHelper.isSameObject", () => {
  it("compares nested objects and arrays by value", () => {
    expect(
      ObjectsHelper.isSameObject(
        { user: { name: "Ada" }, tags: ["math", "logic"] },
        { user: { name: "Ada" }, tags: ["math", "logic"] },
      ),
    ).toBe(true);
    expect(
      ObjectsHelper.isSameObject(
        { user: { name: "Ada" } },
        { user: { name: "Grace" } },
      ),
    ).toBe(false);
  });

  it("compares special object types by value", () => {
    expect(
      ObjectsHelper.isSameObject(
        new Date("2025-01-01T00:00:00.000Z"),
        new Date("2025-01-01T00:00:00.000Z"),
      ),
    ).toBe(true);
    expect(
      ObjectsHelper.isSameObject(new Set([{ value: 1 }]), new Set([{ value: 1 }])),
    ).toBe(true);
    expect(
      ObjectsHelper.isSameObject(
        new Map([["key", { value: 1 }]]),
        new Map([["key", { value: 1 }]]),
      ),
    ).toBe(true);
  });

  it("treats null and undefined as equivalent", () => {
    expect(ObjectsHelper.isSameObject(null, undefined)).toBe(true);
    expect(ObjectsHelper.isSameObject(undefined, null)).toBe(true);
  });

  it("compares other values using deep equality semantics", () => {
    expect(ObjectsHelper.isSameObject(1, 1)).toBe(true);
    expect(ObjectsHelper.isSameObject(1, "1")).toBe(false);
    expect(ObjectsHelper.isSameObject([1, 2], [2, 1])).toBe(false);
  });
});
