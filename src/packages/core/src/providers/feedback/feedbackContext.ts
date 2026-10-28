import React from "react";

export interface FeedbackContextData {
  visibleItems: string[];
  isItemVisible: (id: string) => boolean;
  showItem: (id: string) => void;
  hideItem: (id: string) => void;
}

export const FeedbackProviderContext =
  React.createContext<FeedbackContextData | undefined>(undefined);
