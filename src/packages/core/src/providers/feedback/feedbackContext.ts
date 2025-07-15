import React from "react";

export type FeedbackItemType =
  | "none"
  | "modal"
  | "drawer"
  | "skeleton"
  | "toast";

export interface FeedbackItem {
  id: string;
  type: FeedbackItemType;
  content: React.ReactNode;
}

export interface FeedbackContextData {
  visibleItems: FeedbackItem[];
  isItemVisible: (id: string) => boolean;
  showItem: (id: string) => void;
  hideItem: (id: string) => void;
}

export const FeedbackProviderContext = React.createContext<FeedbackContextData>(
  {
    visibleItems: [],
    isItemVisible: () => false,
    showItem: () => {},
    hideItem: () => {},
  }
);
