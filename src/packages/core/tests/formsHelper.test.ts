import { describe, expect, it } from "vitest";
import { FormsHelper } from "../src/helpers/formsHelper";

describe("FormsHelper", () => {
  describe("getFieldValue", () => {
    it.each([
      ["zero", 0],
      ["false", false],
      ["empty string", ""],
    ])("returns %s values", (_, value) => {
      expect(FormsHelper.getFieldValue({ name: "field", value })).toBe(value);
    });

    it("returns undefined when the field or its value is missing", () => {
      expect(FormsHelper.getFieldValue(undefined)).toBeUndefined();
      expect(FormsHelper.getFieldValue({ name: "field" })).toBeUndefined();
      expect(
        FormsHelper.getFieldValue({ name: "field", value: null }),
      ).toBeUndefined();
    });

    it("returns the original value without converting its type", () => {
      const value = FormsHelper.getFieldValue<number>({
        name: "field",
        value: "42",
      });

      expect(value).toBe("42");
    });
  });

  describe("getFieldValueOrDefault", () => {
    it.each([
      ["zero", 0],
      ["false", false],
      ["empty string", ""],
    ])("preserves %s instead of using the default", (_, value) => {
      expect(
        FormsHelper.getFieldValueOrDefault(
          { name: "field", value },
          "default",
        ),
      ).toBe(value);
    });

    it("uses the default only when the field value is absent", () => {
      expect(
        FormsHelper.getFieldValueOrDefault(undefined, "default"),
      ).toBe("default");
      expect(
        FormsHelper.getFieldValueOrDefault(
          { name: "field", value: undefined },
          "default",
        ),
      ).toBe("default");
      expect(
        FormsHelper.getFieldValueOrDefault(
          { name: "field", value: null },
          "default",
        ),
      ).toBe("default");
    });
  });
});
