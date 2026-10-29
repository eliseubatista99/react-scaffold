import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollHelper } from "../src/helpers/scrollHelper";

afterEach(() => {
  vi.unstubAllGlobals();
  ScrollHelper.enableScroll();
  document.body.removeAttribute("style");
  document.head.querySelectorAll("style[data-scroll-helper-test]").forEach((style) => {
    style.remove();
  });
});

describe("ScrollHelper", () => {
  it("reports scrolling as enabled when no overflow style is set", () => {
    document.body.removeAttribute("style");

    expect(ScrollHelper.isScrollEnabled()).toBe(true);
  });

  it("uses computed vertical overflow from stylesheets", () => {
    const style = document.createElement("style");
    style.dataset.scrollHelperTest = "";
    style.textContent = "body { overflow-y: hidden; }";
    document.head.append(style);

    expect(ScrollHelper.isScrollEnabled()).toBe(false);
  });

  it("disables scrolling and restores the previous inline overflow", () => {
    document.body.style.setProperty("overflow", "scroll", "important");

    ScrollHelper.disableScroll();

    expect(document.body.style.getPropertyValue("overflow")).toBe("hidden");
    expect(ScrollHelper.isScrollEnabled()).toBe(false);

    ScrollHelper.enableScroll();

    expect(document.body.style.getPropertyValue("overflow")).toBe("scroll");
    expect(document.body.style.getPropertyPriority("overflow")).toBe("important");
    expect(ScrollHelper.isScrollEnabled()).toBe(true);
  });

  it("removes the inline overflow when none was present before disabling", () => {
    document.body.style.removeProperty("overflow");

    ScrollHelper.disableScroll();
    ScrollHelper.enableScroll();

    expect(document.body.style.getPropertyValue("overflow")).toBe("");
  });

  it("makes repeated disable calls idempotent", () => {
    document.body.style.overflow = "auto";

    ScrollHelper.disableScroll();
    ScrollHelper.disableScroll();
    ScrollHelper.enableScroll();

    expect(document.body.style.overflow).toBe("auto");
  });

  it("does not modify overflow when enabling without a prior disable", () => {
    document.body.style.overflow = "hidden";

    ScrollHelper.enableScroll();

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("does not access the DOM during server-side rendering", () => {
    vi.stubGlobal("document", undefined);

    expect(() => ScrollHelper.disableScroll()).not.toThrow();
    expect(() => ScrollHelper.enableScroll()).not.toThrow();
    expect(ScrollHelper.isScrollEnabled()).toBe(true);
  });
});
