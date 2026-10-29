import { useContext } from "react";
import {
  FeedbackActionsContext,
  FeedbackStateContext,
} from "./feedbackContext";

export const useFeedback = () => {
  const stateContext = useContext(FeedbackStateContext);
  const actionsContext = useContext(FeedbackActionsContext);

  if (!stateContext || !actionsContext) {
    throw new Error("useFeedback must be used within a FeedbackProvider.");
  }

  return { ...stateContext, ...actionsContext };
};

export const useFeedbackActions = () => {
  const actionsContext = useContext(FeedbackActionsContext);

  if (!actionsContext) {
    throw new Error("useFeedbackActions must be used within a FeedbackProvider.");
  }

  return actionsContext;
};
