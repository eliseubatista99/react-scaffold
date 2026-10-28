import { createContext } from "react";

export interface NavigationHistoryTracker {
  entries: string[];
  index: number;
}

export const NavigationHistoryContext =
  createContext<NavigationHistoryTracker | null>(null);
