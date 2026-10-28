import { useContext } from "react";
import { FeedbackProviderContext } from "./feedbackContext";

export const useFeedback = () => {
  const feedbackContext = useContext(FeedbackProviderContext);

  if (!feedbackContext) {
    throw new Error("useFeedback must be used within a FeedbackProvider.");
  }

  const isItemVisible = (id: string) => {
    return feedbackContext.visibleItems.some((item) => item === id);
  };

  const showItem = (id: string) => {
    feedbackContext.showItem(id);
  };

  const hideItem = (id: string) => {
    feedbackContext.hideItem(id);
  };

  return {
    visibleItems: feedbackContext.visibleItems,
    isItemVisible,
    showItem,
    hideItem,
  };
};
