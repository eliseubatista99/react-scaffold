import { useContext } from "react";
import { FeedbackProviderContext } from "./feedbackContext";

export const useFeedback = () => {
  const feedbackContext = useContext(FeedbackProviderContext);

  if (!feedbackContext) {
    throw new Error("useFeedback must be used within a FeedbackProvider.");
  }

  return feedbackContext;
};
