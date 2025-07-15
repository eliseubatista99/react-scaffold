import { useContext } from "react";
import {
  FeedbackProviderContext,
  type FeedbackItemType,
} from "./feedbackContext";

export const useFeedback = () => {
  const feedbackContext = useContext(FeedbackProviderContext);

  const getVisibleItemsOfType = (type: FeedbackItemType) => {
    return feedbackContext.visibleItems.filter((item) => item.type === type);
  };

  const isItemVisible = (id: string) => {
    return feedbackContext.visibleItems.some((item) => item.id === id);
  };

  const showItem = (id: string) => {
    feedbackContext.showItem(id);
  };

  const hideItem = (id: string) => {
    feedbackContext.hideItem(id);
  };

  return {
    visibleItems: feedbackContext.visibleItems,
    getVisibleItemsOfType,
    isItemVisible,
    showItem,
    hideItem,
  };
};
