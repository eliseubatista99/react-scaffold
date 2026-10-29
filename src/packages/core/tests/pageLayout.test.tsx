import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PageLayout } from "../src/components/pageLayout/pageLayout";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("PageLayout", () => {
  it("defaults descendants to relative positioning and allows explicit overrides", () => {
    render(
      <PageLayout>
        <main data-testid="default-position">
          <div data-testid="custom-position" style={{ position: "absolute" }} />
        </main>
      </PageLayout>,
    );

    expect(
      window.getComputedStyle(screen.getByTestId("default-position")).position,
    ).toBe("relative");
    expect(
      window.getComputedStyle(screen.getByTestId("custom-position")).position,
    ).toBe("absolute");
  });

  it("renders floating content as a viewport-anchored layer", () => {
    render(
      <PageLayout floatingContent={<button>Help</button>}>
        <main>Page content</main>
      </PageLayout>,
    );

    const floatingLayer = document.getElementById("page-floating-content");

    expect(screen.getByRole("button", { name: "Help" })).toBeTruthy();
    expect(floatingLayer?.style.position).toBe("fixed");
    expect(floatingLayer?.style.right).toBe("24px");
    expect(floatingLayer?.style.bottom).toBe("24px");
  });

  it("preserves visibility behavior and updates sticky bar spacing on resize", () => {
    let notifyResize: ResizeObserverCallback | undefined;
    const disconnect = vi.fn();

    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = callback;
      }

      observe() {}
      disconnect() {
        disconnect();
      }
      unobserve() {}
    }

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    render(
      <PageLayout
        header={{
          content: <div>Sticky header</div>,
          visibility: "always",
        }}
        footer={{
          content: <div>In-flow footer</div>,
          visibility: "fixed",
        }}
      >
        <main>Page content</main>
      </PageLayout>,
    );

    const header = document.getElementById("page-header");
    const footer = document.getElementById("page-footer");
    const content = document.getElementById("page-content");

    if (!header || !footer || !content) {
      throw new Error("PageLayout did not render the expected layout elements.");
    }

    expect(header?.style.position).toBe("sticky");
    expect(footer?.style.position).toBe("relative");

    vi.spyOn(header, "getBoundingClientRect").mockReturnValue({
      height: 48,
    } as DOMRect);
    vi.spyOn(footer, "getBoundingClientRect").mockReturnValue({
      height: 32,
    } as DOMRect);

    act(() => {
      notifyResize?.([], {} as ResizeObserver);
    });

    expect(content.style.paddingTop).toBe("48px");
    expect(content.style.paddingBottom).toBe("0px");

    cleanup();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
