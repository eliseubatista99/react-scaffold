import React from "react";
import { Routes, Route } from "react-router-dom";
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
  const [history, setHistory] = React.useState<string[]>([]);

  const addToHistory = (entry: string) => {
    setHistory((prevHistory) => [...prevHistory, entry]);
  };

  const popFromHistory = (count: number) => {
    setHistory((prevHistory) =>
      prevHistory.slice(0, prevHistory.length - count)
    );
  };

  const replaceHistory = (entries: string[]) => {
    setHistory(entries);
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
      <Routes>
        {routesList}
        {children}
      </Routes>
    </NavigationProviderContext.Provider>
  );
};
