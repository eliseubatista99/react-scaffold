import { createContext } from "react";

export interface NavigationHistoryTracker {
  entries: { key: string; path: string }[];
  index: number;
}

export const NavigationHistoryContext =
  createContext<NavigationHistoryTracker | null>(null);
