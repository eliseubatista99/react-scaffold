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
  const trackerRef = React.useRef<NavigationHistoryTracker>({
    entries: [location.key],
    index: 0,
  });
  const lastHandledKey = React.useRef(location.key);

  React.useEffect(() => {
    if (lastHandledKey.current === location.key) {
      return;
    }

    lastHandledKey.current = location.key;

    if (navigationType === "PUSH") {
      trackerRef.current.entries = trackerRef.current.entries.slice(
        0,
        trackerRef.current.index + 1,
      );
      trackerRef.current.entries.push(location.key);
      trackerRef.current.index += 1;
      return;
    }

    if (navigationType === "REPLACE") {
      trackerRef.current.entries[trackerRef.current.index] = location.key;
      return;
    }

    const previousIndex = trackerRef.current.entries.indexOf(location.key);

    if (previousIndex >= 0) {
      trackerRef.current.index = previousIndex;
      return;
    }

    trackerRef.current.entries = [location.key];
    trackerRef.current.index = 0;
  }, [location.key, navigationType]);

  const routesList = routes.map((route, index) => (
    <Route
      key={`${route.path}-${index}`}
      path={route.path}
      element={route.render}
    />
  ));

  return (
    <NavigationHistoryContext.Provider value={trackerRef.current}>
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
