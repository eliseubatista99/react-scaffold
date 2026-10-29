import React from "react";

export interface FeedbackStateContextData {
  visibleItems: readonly string[];
  isItemVisible: (id: string) => boolean;
}

export interface FeedbackActionsContextData {
  showItem: (id: string) => void;
  hideItem: (id: string) => void;
}

export const FeedbackStateContext =
  React.createContext<FeedbackStateContextData | undefined>(undefined);

export const FeedbackActionsContext =
  React.createContext<FeedbackActionsContextData | undefined>(undefined);
