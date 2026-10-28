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
import { Link } from "react-router-dom";
import {
  NavigationProvider,
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
});
