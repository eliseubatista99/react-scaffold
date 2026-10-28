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
});
