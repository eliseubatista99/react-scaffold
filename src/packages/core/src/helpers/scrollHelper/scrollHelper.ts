interface SavedOverflow {
  body: HTMLElement;
  value: string;
  priority: string;
}

let savedOverflow: SavedOverflow | undefined;

export class ScrollHelper {
  static isScrollEnabled = (): boolean => {
    if (typeof document === "undefined" || !document.body) {
      return true;
    }

    const body = document.body;
    if (savedOverflow?.body === body) {
      return false;
    }

    const computedStyle = window.getComputedStyle(body);
    const overflowY =
      computedStyle.overflowY ||
      computedStyle.overflow ||
      body.style.overflowY ||
      body.style.overflow;

    return overflowY !== "hidden" && overflowY !== "clip";
  };

  static disableScroll = (): void => {
    if (typeof document === "undefined" || !document.body || savedOverflow) {
      return;
    }

    const body = document.body;
    savedOverflow = {
      body,
      value: body.style.getPropertyValue("overflow"),
      priority: body.style.getPropertyPriority("overflow"),
    };
    body.style.setProperty("overflow", "hidden", "important");
  };

  static enableScroll = (): void => {
    if (!savedOverflow) {
      return;
    }

    const { body, value, priority } = savedOverflow;
    if (value) {
      body.style.setProperty("overflow", value, priority);
    } else {
      body.style.removeProperty("overflow");
    }

    savedOverflow = undefined;
  };
}
