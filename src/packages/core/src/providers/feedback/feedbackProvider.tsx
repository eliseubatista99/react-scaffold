import React from "react";
import { FeedbackProviderContext } from "./feedbackContext";

export interface FeedbackProviderInputProps {
  children?: React.ReactNode;
}

export const FeedbackProvider = ({ children }: FeedbackProviderInputProps) => {
  const visibleItemsRef = React.useRef<string[]>([]);
  const [visibleItems, setVisibleItems] = React.useState<string[]>([]);

  const updateVisibleItems = React.useCallback((value: string[]) => {
    console.log("ZAU UPDATING VISIBLE ITEMS", value);

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

  return (
    <FeedbackProviderContext.Provider
      value={{
        visibleItems,
        isItemVisible,
        showItem,
        hideItem,
      }}
    >
      {children}
    </FeedbackProviderContext.Provider>
  );
};
