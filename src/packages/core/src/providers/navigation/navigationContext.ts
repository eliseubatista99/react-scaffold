import React from "react";

export interface NavigationContextData {
  history: string[];
  addToHistory: (entry: string) => void;
  popFromHistory: (count: number) => string;
  replaceHistory: (entries: string[]) => void;
}

export const NavigationProviderContext =
  React.createContext<NavigationContextData>({
    history: [],
    addToHistory: () => {},
    popFromHistory: () => "",
    replaceHistory: () => {},
  });
