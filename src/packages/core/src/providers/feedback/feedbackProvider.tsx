import React from "react";
import { FeedbackProviderContext, type FeedbackItem } from "./feedbackContext";

export interface FeedbackProviderInputProps {
  items: FeedbackItem[];
  children?: React.ReactNode;
}

export const FeedbackProvider = ({
  items,
  children,
}: FeedbackProviderInputProps) => {
  const visibleItemsRef = React.useRef<FeedbackItem[]>([]);
  const [visibleItems, setVisibleItems] = React.useState<FeedbackItem[]>([]);

  const updateVisibleItems = React.useCallback((value: FeedbackItem[]) => {
    visibleItemsRef.current = value;
    setVisibleItems(value);
  }, []);

  const isItemVisible = React.useCallback((id: string) => {
    return visibleItemsRef.current.some((item) => item.id === id);
  }, []);

  const showItem = React.useCallback(
    (id: string) => {
      const item = items.find((item) => item.id === id);
      const isVisible = isItemVisible(id);

      if (item && !isVisible) {
        updateVisibleItems([...visibleItemsRef.current, item]);
      }
    },
    [isItemVisible, items, updateVisibleItems]
  );

  const hideItem = React.useCallback(
    (id: string) => {
      const isVisible = isItemVisible(id);
      if (isVisible) {
        updateVisibleItems(
          visibleItemsRef.current.filter((item) => item.id !== id)
        );
      }
    },
    [isItemVisible, updateVisibleItems]
  );

  const itemsToRender = React.useCallback(
    () => items.map((item) => <>{isItemVisible(item.id) && item.content}</>),
    [isItemVisible, items]
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
      {itemsToRender()}
      {children}
    </FeedbackProviderContext.Provider>
  );
};
