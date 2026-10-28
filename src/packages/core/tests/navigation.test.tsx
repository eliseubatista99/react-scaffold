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
import { Link, MemoryRouter } from "react-router-dom";
import {
  NavigationProvider,
  NavigationRoutes,
  useNavigation,
  type NavigationProviderRoute,
} from "../src/providers/navigation";

const NavigationControls = () => {
  const { currentPath, goBack, goTo, searchParams } = useNavigation();

  return (
    <div>
      <output data-testid="current-path">{currentPath}</output>
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
});
