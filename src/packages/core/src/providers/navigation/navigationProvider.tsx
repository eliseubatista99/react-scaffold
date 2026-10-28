import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import {
  NavigationHistoryContext,
  type NavigationHistoryTracker,
} from "./navigationHistoryContext";

export interface NavigationProviderRoute {
  path: string;
  render: React.ReactNode;
}

export interface NavigationProviderInputProps {
  isReady?: boolean;
  routes: NavigationProviderRoute[];
  children?: React.ReactNode;
}

export type NavigationRoutesProps = NavigationProviderInputProps;

export const NavigationRoutes = ({
  isReady = true,
  routes,
  children,
}: NavigationRoutesProps) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [historyTracker, setHistoryTracker] =
    React.useState<NavigationHistoryTracker>(() => ({
      entries: [
        {
          key: location.key,
          path: `${location.pathname}${location.search}${location.hash}`,
        },
      ],
      index: 0,
    }));
  const lastHandledKey = React.useRef(location.key);

  React.useEffect(() => {
    if (lastHandledKey.current === location.key) {
      return;
    }

    lastHandledKey.current = location.key;

    setHistoryTracker((current) => {
      const currentEntry = {
        key: location.key,
        path: `${location.pathname}${location.search}${location.hash}`,
      };

      if (navigationType === "PUSH") {
        const entries = current.entries.slice(0, current.index + 1);
        entries.push(currentEntry);
        return { entries, index: entries.length - 1 };
      }

      if (navigationType === "REPLACE") {
        const entries = [...current.entries];
        entries[current.index] = currentEntry;
        return { entries, index: current.index };
      }

      const previousIndex = current.entries.findIndex(
        (entry) => entry.key === location.key,
      );

      if (previousIndex >= 0) {
        return { ...current, index: previousIndex };
      }

      return { entries: [currentEntry], index: 0 };
    });
  }, [
    location.hash,
    location.key,
    location.pathname,
    location.search,
    navigationType,
  ]);

  const routesList = routes.map((route, index) => (
    <Route
      key={`${route.path}-${index}`}
      path={route.path}
      element={route.render}
    />
  ));

  return (
    <NavigationHistoryContext.Provider value={historyTracker}>
      {isReady && <Routes>{routesList}</Routes>}
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const NavigationProvider = (props: NavigationProviderInputProps) => {
  return (
    <BrowserRouter>
      <NavigationRoutes {...props} />
    </BrowserRouter>
  );
};
