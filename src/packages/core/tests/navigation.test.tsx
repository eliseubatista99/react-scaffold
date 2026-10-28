import {
  cleanup,
  fireEvent,
  render,
  renderHook,
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
import { Link, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import {
  NavigationProvider,
  NavigationRoutes,
  useNavigation,
  type NavigationProviderRoute,
} from "../src/providers/navigation";

const NavigationControls = () => {
  const { currentPath, goBack, goTo, history, searchParams } = useNavigation();

  return (
    <div>
      <output data-testid="current-path">{currentPath}</output>
      <output data-testid="navigation-history">{JSON.stringify(history)}</output>
      <output data-testid="query-params">
        {JSON.stringify({
          all: searchParams.getAll(),
          tags: searchParams.getAllValues("tag"),
          query: searchParams.get("q"),
          firstTag: searchParams.getMany(["tag"]).tag,
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
            path: "/search?existing=1&omitted=keep&empty=old&tag=old&tag=older#results",
            params: {
              q: "hello world",
              page: 2,
              enabled: true,
              tag: ["react", "router"],
              omitted: null,
              empty: [],
            },
          })
        }
      >
        Go to search
      </button>
      <button
        onClick={() =>
          searchParams.setMany({
            filter: "active",
            tag: ["one", "two"],
            page: 0,
          })
        }
      >
        Set query params
      </button>
      <button onClick={() => searchParams.remove("filter")}>
        Remove query
      </button>
      <button onClick={() => goBack()}>Go back</button>
      <button onClick={() => goBack({ steps: 2 })}>Go back two</button>
      <Link to="/external">Navigate outside useNavigation</Link>
    </div>
  );
};

const routes: NavigationProviderRoute[] = [
  { path: "*", render: <div>Navigation test route</div> },
];

const renderNavigation = () =>
  render(
    <NavigationProvider routes={routes}>
      <NavigationControls />
    </NavigationProvider>,
  );
const currentPath = () => screen.getByTestId("current-path").textContent;

const QueryParamsControls = () => {
  const { searchParams } = useNavigation();

  return (
    <div>
      <output data-testid="query-state">
        {JSON.stringify({
          all: searchParams.getAll(),
          repeated: searchParams.getAllValues("repeated"),
          firstRepeated: searchParams.get("repeated"),
          selected: searchParams.getMany(["repeated", "missing"]),
        })}
      </output>
      <button onClick={() => searchParams.set("single", "value")}>
        Set single param
      </button>
      <button
        onClick={() =>
          searchParams.set("repeated", [
            "first",
            null,
            undefined,
            "last",
          ])
        }
      >
        Set repeated params
      </button>
      <button onClick={() => searchParams.removeMany(["first", "second"])}>
        Remove multiple params
      </button>
      <button
        onClick={() => {
          searchParams.remove("first");
          searchParams.remove("second");
        }}
      >
        Remove params in sequence
      </button>
      <button onClick={() => searchParams.removeAll()}>Remove all params</button>
      <button
        onClick={() => {
          searchParams.set("first", "1");
          searchParams.set("second", "2");
        }}
      >
        Set params in sequence
      </button>
    </div>
  );
};

const RelativeNavigationControls = () => {
  const { goTo } = useNavigation();

  return (
    <div>
      <button onClick={() => goTo({ path: "details" })}>Go to relative path</button>
      <button
        onClick={() =>
          goTo({
            path: "details?existing=1#section",
            params: { existing: "2", added: "value" },
          })
        }
      >
        Go to relative path with params
      </button>
      <button onClick={() => goTo({ path: "/expenses" })}>
        Go to root path
      </button>
      <button onClick={() => goTo({ path: "?tab=overview" })}>
        Go to query-only path
      </button>
      <button onClick={() => goTo({ path: "#section" })}>
        Go to hash-only path
      </button>
    </div>
  );
};

const FallbackNavigationControls = () => {
  const { goBack, goTo } = useNavigation();

  return (
    <div>
      <button onClick={() => goTo({ path: "/one" })}>Go to one</button>
      <button onClick={() => goTo({ path: "/two" })}>Go to two</button>
      <button
        onClick={() =>
          goBack({ defaultBackPath: "/fallback" })
        }
      >
        Back with fallback
      </button>
      <button
        onClick={() =>
          goBack({ steps: 2, defaultBackPath: "/fallback" })
        }
      >
        Back two with fallback
      </button>
      <button onClick={() => goBack({ steps: 2 })}>Back two</button>
    </div>
  );
};

const UntrackedNavigationControls = () => {
  const { goBack } = useNavigation();

  return (
    <div>
      <button onClick={() => goBack()}>Back without tracking</button>
      <button onClick={() => goBack({ defaultBackPath: "/fallback" })}>
        Back with fallback without tracking
      </button>
    </div>
  );
};

const LocationProbe = () => {
  const location = useLocation();

  return (
    <output data-testid="router-location">
      {JSON.stringify({
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      })}
    </output>
  );
};

const renderRelativeNavigation = (initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/parent/current"
          element={<RelativeNavigationControls />}
        />
      </Routes>
      <LocationProbe />
    </MemoryRouter>,
  );

const renderFallbackNavigation = (initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <NavigationRoutes routes={routes}>
        <FallbackNavigationControls />
        <LocationProbe />
      </NavigationRoutes>
    </MemoryRouter>,
  );

const renderUntrackedNavigation = () =>
  render(
    <MemoryRouter
      initialEntries={["/outside", "/initial"]}
      initialIndex={1}
    >
      <UntrackedNavigationControls />
      <LocationProbe />
    </MemoryRouter>,
  );

const renderQueryParams = (initialEntry = "/") =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <QueryParamsControls />
    </MemoryRouter>,
  );

beforeEach(() => {
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("NavigationProvider", () => {
  it("reports the initial browser path", () => {
    window.history.replaceState({}, "", "/initial?source=direct");
    renderNavigation();

    expect(currentPath()).toBe("/initial");
  });

  it("uses browser history for goTo navigation and goBack", async () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go first" }));
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));

    expect(currentPath()).toBe("/second");

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/first");
    });
  });

  it("replaces the current browser history entry", async () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go first" }));
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));
    fireEvent.click(screen.getByRole("button", { name: "Replace current" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/replacement");
    });

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/first");
    });
  });

  it("exposes observed navigation history and trims entries after a new push", async () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go first" }));
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));
    fireEvent.click(screen.getByRole("button", { name: "Replace current" }));

    await waitFor(() => {
      expect(screen.getByTestId("navigation-history").textContent).toBe(
        JSON.stringify(["/", "/first", "/replacement"]),
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));
    await waitFor(() => expect(currentPath()).toBe("/first"));
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));

    await waitFor(() => {
      expect(screen.getByTestId("navigation-history").textContent).toBe(
        JSON.stringify(["/", "/first", "/second"]),
      );
    });
  });

  it("supports going back multiple browser history entries", async () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go first" }));
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Go to search" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Go back two" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/first");
    });
  });

  it("uses defaultBackPath when no tracked in-app history entry is available", async () => {
    renderFallbackNavigation("/initial");
    fireEvent.click(
      screen.getByRole("button", { name: "Back with fallback" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/fallback",
          search: "",
          hash: "",
        }),
      ),
    );
  });

  it("prefers normal back navigation when tracked in-app history is available", async () => {
    renderFallbackNavigation("/initial");
    fireEvent.click(screen.getByRole("button", { name: "Go to one" }));

    fireEvent.click(
      screen.getByRole("button", { name: "Back with fallback" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/initial",
          search: "",
          hash: "",
        }),
      ),
    );
  });

  it("uses defaultBackPath when tracked history has fewer entries than steps", async () => {
    renderFallbackNavigation("/initial");
    fireEvent.click(screen.getByRole("button", { name: "Go to one" }));

    fireEvent.click(
      screen.getByRole("button", { name: "Back two with fallback" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/fallback",
          search: "",
          hash: "",
        }),
      ),
    );
  });

  it("limits back navigation to the observed in-app history", async () => {
    renderFallbackNavigation("/initial");
    fireEvent.click(screen.getByRole("button", { name: "Go to one" }));
    fireEvent.click(screen.getByRole("button", { name: "Back two" }));

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/initial",
          search: "",
          hash: "",
        }),
      ),
    );
  });

  it("does not leave the app when no observed back entry exists", async () => {
    window.history.replaceState({}, "", "/outside");
    window.history.pushState({}, "", "/initial");
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));

    await waitFor(() => expect(currentPath()).toBe("/initial"));
  });

  it("does not leave the app when navigation history is not tracked", () => {
    renderUntrackedNavigation();

    fireEvent.click(
      screen.getByRole("button", { name: "Back without tracking" }),
    );

    expect(screen.getByTestId("router-location").textContent).toBe(
      JSON.stringify({
        pathname: "/initial",
        search: "",
        hash: "",
      }),
    );
  });

  it("uses defaultBackPath when navigation history is not tracked", async () => {
    renderUntrackedNavigation();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Back with fallback without tracking",
      }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/fallback",
          search: "",
          hash: "",
        }),
      ),
    );
  });

  it("replaces the current entry when navigating to defaultBackPath", async () => {
    renderFallbackNavigation("/initial");

    fireEvent.click(
      screen.getByRole("button", { name: "Back with fallback" }),
    );
    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toContain(
        '"/fallback"',
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Go to one" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Back with fallback" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/fallback",
          search: "",
          hash: "",
        }),
      ),
    );
  });

  it("rejects invalid goBack step counts", () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: ({ children }) => (
        <NavigationProvider routes={routes}>{children}</NavigationProvider>
      ),
    });

    expect(() => result.current.goBack({ steps: 0 })).toThrow(RangeError);
    expect(() => result.current.goBack({ steps: -1 })).toThrow(RangeError);
    expect(() => result.current.goBack({ steps: 1.5 })).toThrow(RangeError);
  });

  it("builds query strings and supports reading, setting, and removing query params", async () => {
    renderNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Go to search" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/search");
      expect(screen.getByTestId("query-params").textContent).toBe(
        JSON.stringify({
          all: {
            existing: "1",
            omitted: "keep",
            q: "hello world",
            page: "2",
            enabled: "true",
            tag: "router",
          },
          tags: ["react", "router"],
          query: "hello world",
          firstTag: "react",
        }),
      );
    });

    expect(window.location.hash).toBe("#results");

    fireEvent.click(screen.getByRole("button", { name: "Set query params" }));
    await waitFor(() => {
      expect(screen.getByTestId("query-params").textContent).toBe(
        JSON.stringify({
          all: {
            existing: "1",
            omitted: "keep",
            q: "hello world",
            page: "0",
            enabled: "true",
            filter: "active",
            tag: "two",
          },
          tags: ["one", "two"],
          query: "hello world",
          firstTag: "one",
        }),
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
    });

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/");
    });
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

  it("renders configured routes inside an application-owned router", async () => {
    render(
      <MemoryRouter initialEntries={["/inside-router"]}>
        <NavigationRoutes
          routes={[
            {
              path: "/inside-router",
              render: <div data-testid="configured-route">Configured route</div>,
            },
          ]}
        >
          <NavigationControls />
        </NavigationRoutes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("configured-route")).toBeTruthy();
    expect(currentPath()).toBe("/inside-router");

    fireEvent.click(screen.getByRole("button", { name: "Go first" }));

    await waitFor(() => {
      expect(currentPath()).toBe("/first");
    });

    expect(screen.queryByTestId("configured-route")).toBeNull();
  });

  it("resolves paths without a leading slash relative to the current route", async () => {
    renderRelativeNavigation("/parent/current?existing=value");
    fireEvent.click(
      screen.getByRole("button", { name: "Go to relative path" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/parent/current/details",
          search: "",
          hash: "",
        }),
      ),
    );
  });

  it("applies query params without changing relative path resolution", async () => {
    renderRelativeNavigation("/parent/current");
    fireEvent.click(
      screen.getByRole("button", { name: "Go to relative path with params" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/parent/current/details",
          search: "?existing=2&added=value",
          hash: "#section",
        }),
      ),
    );
  });

  it("resolves paths with a leading slash from the router root", async () => {
    renderRelativeNavigation("/parent/current");
    fireEvent.click(screen.getByRole("button", { name: "Go to root path" }));

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/expenses",
          search: "",
          hash: "",
        }),
      ),
    );
  });

  it("resolves query-only paths against the current route", async () => {
    renderRelativeNavigation("/parent/current?existing=value#old");
    fireEvent.click(
      screen.getByRole("button", { name: "Go to query-only path" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/parent/current",
          search: "?tab=overview",
          hash: "",
        }),
      ),
    );
  });

  it("resolves hash-only paths against the current route", async () => {
    renderRelativeNavigation("/parent/current?existing=value#old");
    fireEvent.click(
      screen.getByRole("button", { name: "Go to hash-only path" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("router-location").textContent).toBe(
        JSON.stringify({
          pathname: "/parent/current",
          search: "",
          hash: "#section",
        }),
      ),
    );
  });

  it("renders children but not configured routes when isReady is false", () => {
    render(
      <MemoryRouter initialEntries={["/not-ready"]}>
        <NavigationRoutes
          isReady={false}
          routes={[
            {
              path: "/not-ready",
              render: <div data-testid="not-ready-route">Route</div>,
            },
          ]}
        >
          <div data-testid="not-ready-child">Child</div>
        </NavigationRoutes>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("not-ready-route")).toBeNull();
    expect(screen.getByTestId("not-ready-child")).toBeTruthy();
  });
});

describe("Navigation query params", () => {
  it("supports setting scalar and repeated values while skipping nullish array items", async () => {
    renderQueryParams();

    fireEvent.click(screen.getByRole("button", { name: "Set single param" }));
    await waitFor(() =>
      expect(screen.getByTestId("query-state").textContent).toContain(
        '"single":"value"',
      ),
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Set repeated params" }),
    );
    await waitFor(() => {
      expect(screen.getByTestId("query-state").textContent).toBe(
        JSON.stringify({
          all: { single: "value", repeated: "last" },
          repeated: ["first", "last"],
          firstRepeated: "first",
          selected: { repeated: "first", missing: null },
        }),
      );
    });
  });

  it("supports removing multiple and all query params", async () => {
    renderQueryParams("/?keep=value&first=1&second=2");

    fireEvent.click(
      screen.getByRole("button", { name: "Remove multiple params" }),
    );
    await waitFor(() =>
      expect(screen.getByTestId("query-state").textContent).toBe(
        JSON.stringify({
          all: { keep: "value" },
          repeated: [],
          firstRepeated: null,
          selected: { repeated: null, missing: null },
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove all params" }));
    await waitFor(() =>
      expect(screen.getByTestId("query-state").textContent).toBe(
        JSON.stringify({
          all: {},
          repeated: [],
          firstRepeated: null,
          selected: { repeated: null, missing: null },
        }),
      ),
    );
  });

  it("preserves sequential query updates made during the same event", async () => {
    renderQueryParams();

    fireEvent.click(
      screen.getByRole("button", { name: "Set params in sequence" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("query-state").textContent).toContain(
        '"first":"1","second":"2"',
      ),
    );
  });

  it("preserves sequential query removals made during the same event", async () => {
    renderQueryParams("/?first=1&second=2");

    fireEvent.click(
      screen.getByRole("button", { name: "Remove params in sequence" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("query-state").textContent).toContain(
        '"all":{}',
      ),
    );
  });

  it("returns __proto__ as an own query key from getMany", () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/?__proto__=safe"]}>
          {children}
        </MemoryRouter>
      ),
    });
    const values = result.current.searchParams.getMany(["__proto__"]);

    expect(Object.getOwnPropertyDescriptor(values, "__proto__")?.value).toBe(
      "safe",
    );
  });

  it("keeps getAll stable between renders and updates it when query params change", async () => {
    const { result, rerender } = renderHook(() => useNavigation(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/?initial=value"]}>
          {children}
        </MemoryRouter>
      ),
    });
    const getAll = result.current.searchParams.getAll;

    rerender();

    expect(result.current.searchParams.getAll).toBe(getAll);
    expect(result.current.searchParams.getAll()).toEqual({ initial: "value" });

    result.current.searchParams.set("updated", "yes");

    await waitFor(() => {
      expect(result.current.searchParams.getAll).not.toBe(getAll);
      expect(result.current.searchParams.getAll()).toEqual({
        initial: "value",
        updated: "yes",
      });
    });
  });
});
