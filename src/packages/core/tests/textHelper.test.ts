import { describe, expect, it } from "vitest";
import { TextHelper } from "../src/helpers/text";

describe("TextHelper", () => {
  describe("getPascalCase", () => {
    it("capitalizes each word while preserving spaces and punctuation", () => {
      expect(TextHelper.getPascalCase("hELLO, wORLD!")).toBe("Hello, World!");
    });

    it("uppercases supplementary Unicode letters by code point", () => {
      expect(TextHelper.getPascalCase("𐐨abc")).toBe("𐐀abc");
    });

    it("keeps combining marks attached to their letters", () => {
      expect(TextHelper.getPascalCase("e\u0301COLE")).toBe("E\u0301cole");
    });
  });

  describe("isEqual", () => {
    it("compares strings case-sensitively by default", () => {
      expect(TextHelper.isEqual("Text", "text")).toBe(false);
    });

    it("supports case-insensitive comparison", () => {
      expect(TextHelper.isEqual("Text", "text", false)).toBe(true);
    });
  });

  describe("validators", () => {
    it("accepts and rejects email strings using its basic syntax rule", () => {
      expect(TextHelper.isEmail("person@example.com")).toBe(true);
      expect(TextHelper.isEmail("not-an-email")).toBe(false);
    });

    it("accepts only compact phone numbers with an optional leading plus", () => {
      expect(TextHelper.isPhoneNumber("+123456789")).toBe(true);
      expect(TextHelper.isPhoneNumber("123 456 789")).toBe(false);
    });

    it("accepts Latin names with the supported separators", () => {
      expect(TextHelper.isValidName("Anne-Marie O'Neil")).toBe(true);
      expect(TextHelper.isValidName("Renée")).toBe(true);
      expect(TextHelper.isValidName("李")).toBe(false);
    });
  });
});
