import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Link, MemoryRouter } from "react-router-dom";
import {
  NavigationProvider,
  useNavigation,
  type NavigationProviderRoute,
} from "../src/providers/navigation";
import { NavigationProviderContext } from "../src/providers/navigation/navigationContext";
import type { NavigationContextData } from "../src/providers/navigation/navigationContext";

const NavigationControls = () => {
  const { currentPath, history, goBack, goTo, searchParams } = useNavigation();

  return (
    <div>
      <output data-testid="current-path">{currentPath}</output>
      <output data-testid="history">{JSON.stringify(history)}</output>
      <output data-testid="query-params">
        {JSON.stringify({
          all: searchParams.getAll(),
          query: searchParams.get<string>("q"),
        })}
      </output>
      <button onClick={() => goTo({ path: "/first" })}>Go first</button>
      <button onClick={() => goTo({ path: "/second" })}>Go second</button>
      <button
        onClick={() =>
          goTo({ path: "/replacement", addToHistory: false })
        }
      >
        Replace current
      </button>
      <button
        onClick={() =>
          goTo({
            path: "/search?existing=1",
            params: { q: "hello world", page: 2, omitted: null },
          })
        }
      >
        Go to search
      </button>
      <button onClick={() => searchParams.set("filter", "active")}>
        Set query
      </button>
      <button onClick={() => searchParams.remove("filter")}>
        Remove query
      </button>
      <button onClick={() => goBack({})}>Go back</button>
      <button onClick={() => goBack({ steps: 2 })}>Go back two</button>
      <button onClick={() => goBack({ defaultBackPath: "/fallback" })}>
        Go back with fallback
      </button>
      <Link to="/external">Navigate outside useNavigation</Link>
    </div>
  );
};

const routes: NavigationProviderRoute[] = [
  { path: "*", render: <div>Navigation test route</div> },
];

const NavigationCallbackControls = () => {
  const { currentPath, clearHistory, goBack, goTo } = useNavigation();

  return (
    <div>
      <output data-testid="callback-path">{currentPath}</output>
      <button onClick={() => goTo({ path: "/next" })}>Callback go to</button>
      <button onClick={() => goBack()}>Callback go back</button>
      <button onClick={clearHistory}>Callback clear history</button>
    </div>
  );
};

const renderNavigationCallbacks = (contextValue: NavigationContextData) =>
  render(
    <MemoryRouter initialEntries={["/previous", "/current"]} initialIndex={1}>
      <NavigationProviderContext.Provider value={contextValue}>
        <NavigationCallbackControls />
      </NavigationProviderContext.Provider>
    </MemoryRouter>,
  );

const renderNavigation = () =>
  render(
    <NavigationProvider routes={routes}>
      <NavigationControls />
    </NavigationProvider>,
  );

const currentPath = () => screen.getByTestId("current-path").textContent;
const history = () => screen.getByTestId("history").textContent;

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("NavigationProvider", () => {
  it("reports the initial browser path without adding it to the internal history", () => {
    window.history.replaceState({}, "", "/initial?source=direct");
    renderNavigation();

    expect(currentPath()).toBe("/initial");
    expect(history()).toBe("[]");
  });

  it("tracks goTo navigation and goes back through the tracked entries", async () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go first" }));
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));

    expect(currentPath()).toBe("/second");
    expect(history()).toBe(JSON.stringify(["/first", "/second"]));

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/first");
      expect(history()).toBe(JSON.stringify(["/first"]));
    });
  });

  it("replaces the current browser and internal history entries", async () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go first" }));
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));
    fireEvent.click(screen.getByRole("button", { name: "Replace current" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/replacement");
      expect(history()).toBe(JSON.stringify(["/first", "/replacement"]));
    });

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/first");
    });
  });

  it("supports going back multiple tracked entries", async () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go first" }));
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Go to search" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Go back two" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/first");
      expect(history()).toBe(JSON.stringify(["/first"]));
    });
  });

  it("uses the fallback path when its internal history is empty", async () => {
    window.history.replaceState({}, "", "/initial");
    renderNavigation();

    fireEvent.click(
      screen.getByRole("button", { name: "Go back with fallback" }),
    );

    await waitFor(() => {
      expect(currentPath()).toBe("/fallback");
      expect(history()).toBe("[]");
    });
  });

  it("builds query strings and supports reading, setting, and removing query params", async () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go to search" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/search");
      expect(screen.getByTestId("query-params").textContent).toBe(
        JSON.stringify({
          all: { existing: "1", q: "hello world", page: "2" },
          query: "hello world",
        }),
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Set query" }));

    await waitFor(() => {
      expect(screen.getByTestId("query-params").textContent).toContain(
        '"filter":"active"',
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Remove query" }));

    await waitFor(() => {
      expect(screen.getByTestId("query-params").textContent).not.toContain(
        '"filter"',
      );
    });
  });

  it("updates currentPath for navigation initiated outside useNavigation", async () => {
    renderNavigation();

    fireEvent.click(
      screen.getByRole("link", { name: "Navigate outside useNavigation" }),
    );

    await waitFor(() => {
      expect(currentPath()).toBe("/external");
      expect(history()).toBe("[]");
    });
  });

  it("uses the current navigation context in callbacks after the context changes", async () => {
    const initialContext: NavigationContextData = {
      history: [],
      addToHistory: vi.fn(),
      popFromHistory: vi.fn(),
      replaceHistory: vi.fn(),
    };
    const updatedContext: NavigationContextData = {
      history: ["/previous"],
      addToHistory: vi.fn(),
      popFromHistory: vi.fn(),
      replaceHistory: vi.fn(),
    };
    const view = renderNavigationCallbacks(initialContext);

    view.rerender(
      <MemoryRouter
        initialEntries={["/previous", "/current"]}
        initialIndex={1}
      >
        <NavigationProviderContext.Provider value={updatedContext}>
          <NavigationCallbackControls />
        </NavigationProviderContext.Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Callback go back" }));

    await waitFor(() => {
      expect(screen.getByTestId("callback-path").textContent).toBe("/previous");
    });
    expect(updatedContext.popFromHistory).toHaveBeenCalledWith(1);
    expect(initialContext.popFromHistory).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Callback go to" }));
    await waitFor(() => {
      expect(screen.getByTestId("callback-path").textContent).toBe("/next");
    });
    expect(updatedContext.addToHistory).toHaveBeenCalledWith("/next");
    expect(initialContext.addToHistory).not.toHaveBeenCalled();

    view.rerender(
      <MemoryRouter
        initialEntries={["/previous", "/current"]}
        initialIndex={1}
      >
        <NavigationProviderContext.Provider value={updatedContext}>
          <NavigationCallbackControls />
        </NavigationProviderContext.Provider>
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Callback clear history" }),
    );
    expect(updatedContext.replaceHistory).toHaveBeenCalledWith([]);
    expect(initialContext.replaceHistory).not.toHaveBeenCalled();
  });

  it("renders route lists without React missing-key warnings", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <NavigationProvider
        routes={[
          { path: "/first", render: <div>First</div> },
          { path: "/second", render: <div>Second</div> },
        ]}
      />,
    );

    expect(consoleError).not.toHaveBeenCalledWith(
      expect.stringContaining("unique"),
    );
  });
});
