import React from "react";
import {
  FeedbackActionsContext,
  FeedbackStateContext,
} from "./feedbackContext";

export interface FeedbackProviderInputProps {
  children?: React.ReactNode;
}

export const FeedbackProvider = ({ children }: FeedbackProviderInputProps) => {
  const visibleItemsRef = React.useRef<string[]>([]);
  const [visibleItems, setVisibleItems] = React.useState<string[]>([]);

  const updateVisibleItems = React.useCallback((value: string[]) => {
    visibleItemsRef.current = value;
    setVisibleItems(value);
  }, []);

  const isItemVisible = React.useCallback((id: string) => {
    return visibleItemsRef.current.some((item) => item === id);
  }, []);

  const showItem = React.useCallback(
    (id: string) => {
      const isVisible = isItemVisible(id);

      if (!isVisible) {
        updateVisibleItems([...visibleItemsRef.current, id]);
      }
    },
    [isItemVisible, updateVisibleItems]
  );

  const hideItem = React.useCallback(
    (id: string) => {
      const isVisible = isItemVisible(id);
      if (isVisible) {
        updateVisibleItems(
          visibleItemsRef.current.filter((item) => item !== id)
        );
      }
    },
    [isItemVisible, updateVisibleItems]
  );

  const stateContextValue = React.useMemo(
    () => ({
      visibleItems,
      isItemVisible,
    }),
    [visibleItems, isItemVisible]
  );

  const actionsContextValue = React.useMemo(
    () => ({
      showItem,
      hideItem,
    }),
    [showItem, hideItem]
  );

  return (
    <FeedbackActionsContext.Provider value={actionsContextValue}>
      <FeedbackStateContext.Provider value={stateContextValue}>
        {children}
      </FeedbackStateContext.Provider>
    </FeedbackActionsContext.Provider>
  );
};
