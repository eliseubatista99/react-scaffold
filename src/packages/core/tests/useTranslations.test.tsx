import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTranslations } from "../src/hooks/useTranslations";

describe("useTranslations", () => {
  const translations = {
    greeting: {
      en: "Hello",
      pt: "Olá",
    },
    englishOnly: {
      en: "English only",
    },
  };

  it("returns undefined from getTranslation when the requested language is missing", () => {
    const { result } = renderHook(() =>
      useTranslations({ language: "pt", translations }),
    );

    expect(result.current.getTranslation(translations.englishOnly)).toBe(
      undefined,
    );
    expect(result.current.getTranslation(undefined)).toBeUndefined();
  });

  it("returns the key from t when the key or requested language is missing", () => {
    const { result } = renderHook(() =>
      useTranslations({ language: "pt", translations }),
    );

    expect(result.current.t("unknown.key")).toBe("unknown.key");
    expect(result.current.t("englishOnly")).toBe("englishOnly");
  });

  it("returns the requested language translation when available", () => {
    const { result } = renderHook(() =>
      useTranslations({ language: "pt", translations }),
    );

    expect(result.current.getTranslation(translations.greeting)).toBe("Olá");
    expect(result.current.t("greeting")).toBe("Olá");
  });

  it("interpolates string, number, and boolean values", () => {
    const { result } = renderHook(() =>
      useTranslations({
        language: "en",
        translations: {
          values: {
            en: "Name: {{name}}, count: {{count}}, active: {{active}}",
          },
        },
      }),
    );

    expect(
      result.current.t("values", {
        name: "Ada",
        count: 3,
        active: false,
      }),
    ).toBe("Name: Ada, count: 3, active: false");
  });

  it("converts null and undefined values to their string representations", () => {
    const { result } = renderHook(() =>
      useTranslations({
        language: "en",
        translations: {
          values: {
            en: "Null: {{nullValue}}, missing: {{undefinedValue}}",
          },
        },
      }),
    );

    expect(
      result.current.t("values", {
        nullValue: null,
        undefinedValue: undefined,
      }),
    ).toBe("Null: null, missing: undefined");
  });

  it("converts unsupported runtime values to their natural string representations", () => {
    const { result } = renderHook(() =>
      useTranslations({
        language: "en",
        translations: {
          values: {
            en: "Object: {{objectValue}}, array: {{arrayValue}}",
          },
        },
      }),
    );

    const values = {
      objectValue: { label: "object" },
      arrayValue: ["array"],
    } as unknown as Record<string, string>;

    expect(result.current.t("values", values)).toBe(
      "Object: [object Object], array: array",
    );
  });
});
