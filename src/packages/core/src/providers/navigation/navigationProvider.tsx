import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationProviderContext } from "./navigationContext";

export interface NavigationProviderRoute {
  path: string;
  render: React.ReactNode;
}

export interface NavigationProviderInputProps {
  routes: NavigationProviderRoute[];
  children?: React.ReactNode;
}

export const NavigationProvider = ({
  routes,
  children,
}: NavigationProviderInputProps) => {
  const historyRef = React.useRef<string[]>(["/"]);
  const [history, setHistory] = React.useState<string[]>(["/"]);

  const updateHistory = React.useCallback((value: string[]) => {
    historyRef.current = value;
    setHistory(value);
  }, []);

  const addToHistory = (entry: string) => {
    updateHistory([...historyRef.current, entry]);
  };

  const popFromHistory = (count: number) => {
    let newLocation = "";
    let newHistory: string[] = [];

    if (historyRef.current.length === 0) {
      return "/";
    }

    if (historyRef.current.length <= count) {
      newLocation = historyRef.current[0];
      newHistory = [newLocation];
    } else {
      newHistory = historyRef.current.slice(
        0,
        historyRef.current.length - count
      );

      newLocation = newHistory[newHistory.length - 1];
    }

    updateHistory(newHistory);

    return newLocation;
  };

  const replaceHistory = (entries: string[]) => {
    updateHistory(entries);
  };

  const routesList = routes.map((route) => (
    <Route path={route.path} element={route.render} />
  ));

  return (
    <NavigationProviderContext.Provider
      value={{
        history,
        addToHistory,
        popFromHistory,
        replaceHistory,
      }}
    >
      <BrowserRouter>
        <Routes>{routesList}</Routes>
        {children}
      </BrowserRouter>
    </NavigationProviderContext.Provider>
  );
};
