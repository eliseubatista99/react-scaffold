import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationProviderContext } from "./navigationContext";

export interface NavigationProviderRoute {
  path: string;
  render: React.ReactNode;
}

export interface NavigationProviderInputProps {
  isReady?: boolean;
  routes: NavigationProviderRoute[];
  children?: React.ReactNode;
}

export const NavigationProvider = ({
  isReady = true,
  routes,
  children,
}: NavigationProviderInputProps) => {
  const historyRef = React.useRef<string[]>([]);
  const [history, setHistory] = React.useState<string[]>([]);

  const updateHistory = React.useCallback((value: string[]) => {
    historyRef.current = value;
    setHistory(value);
  }, []);

  const addToHistory = React.useCallback(
    (entry: string, replace = false) => {
      let newHistory = [...historyRef.current];

      if (replace) {
        newHistory = newHistory.slice(0, newHistory.length - 1);
      }

      newHistory = [...newHistory, entry];

      updateHistory(newHistory);
    },
    [updateHistory],
  );

  const popFromHistory = React.useCallback(
    (count: number) => {
      if (historyRef.current.length === 0 || historyRef.current.length < count) {
        return "/";
      }

      const newHistory = historyRef.current.slice(
        0,
        historyRef.current.length - count,
      );
      const newLocation = newHistory[newHistory.length - 1];

      updateHistory(newHistory);
      return newLocation;
    },
    [updateHistory],
  );

  const replaceHistory = React.useCallback(
    (entries: string[]) => {
      updateHistory(entries);
    },
    [updateHistory],
  );

  const routesList = routes.map((route, index) => (
    <Route
      key={`${route.path}-${index}`}
      path={route.path}
      element={route.render}
    />
  ));
  const contextValue = React.useMemo(
    () => ({
      history,
      addToHistory,
      popFromHistory,
      replaceHistory,
    }),
    [history, addToHistory, popFromHistory, replaceHistory],
  );

  return (
    <NavigationProviderContext.Provider
      value={contextValue}
    >
      <BrowserRouter>
        <>
          {isReady && <Routes>{routesList}</Routes>}
          {children}
        </>
      </BrowserRouter>
    </NavigationProviderContext.Provider>
  );
};
