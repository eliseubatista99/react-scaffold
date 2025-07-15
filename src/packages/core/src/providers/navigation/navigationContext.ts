import React from "react";

export interface NavigationContextData {
  history: string[];
  addToHistory: (entry: string) => void;
  popFromHistory: (count: number) => void;
  replaceHistory: (entries: string[]) => void;
}

export const NavigationProviderContext =
  React.createContext<NavigationContextData>({
    history: [],
    addToHistory: () => {},
    popFromHistory: () => {},
    replaceHistory: () => {},
  });
