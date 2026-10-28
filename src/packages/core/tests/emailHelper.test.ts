import { describe, expect, it } from "vitest";
import { EmailHelper } from "../src/helpers";

describe("EmailHelper.maskEmail", () => {
  it("masks all but the first local-part character", () => {
    expect(EmailHelper.maskEmail("john@example.com")).toBe("j***@example.com");
  });

  it("trims surrounding whitespace before masking", () => {
    expect(EmailHelper.maskEmail("  john@example.com  ")).toBe(
      "j***@example.com",
    );
  });

  it("preserves supplementary Unicode characters in the visible part", () => {
    expect(EmailHelper.maskEmail("𐐨@example.com")).toBe("𐐨***@example.com");
  });

  it.each([null, undefined, "", "   "])(
    "returns an empty string for empty input",
    (email) => {
      expect(EmailHelper.maskEmail(email)).toBe("");
    },
  );

  it.each(["invalid", "@example.com", "john@", "john@@example.com"])(
    "throws for malformed emails",
    (email) => {
      expect(() => EmailHelper.maskEmail(email)).toThrow(TypeError);
    },
  );
});
