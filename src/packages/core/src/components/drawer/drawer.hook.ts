import React from "react";
import { useDrag } from "../../hooks";
import { useFeedback } from "../../providers";
import type { DrawerProps } from "./drawer";

interface UseDrawerHelperOutput {
  isVisible: boolean;
  drawerParentRef: React.RefCallback<HTMLElement>;
  drawerRef: React.RefCallback<HTMLElement>;
  handleRef: React.RefCallback<HTMLElement>;
  dragStyle: React.CSSProperties;
}

export const useDrawerHelper = ({
  id,
  onCloseDrawer,
  drawerCloseOffset = 15,
}: DrawerProps): UseDrawerHelperOutput => {
  const { isItemVisible } = useFeedback();

  const closeTriggered = React.useRef(false);
  const {
    ref: dragRef,
    containerRef: drawerParentRef,
    handleRef,
    style: dragStyle,
  } = useDrag({
    axis: "y",
    bounds: false,
    resetOnDragEnd: true,
    onDragStart: () => {
      closeTriggered.current = false;
    },
    onDrag: ({ delta }) => {
      const drawerHeight =
        drawerRef.current?.getBoundingClientRect().height ?? 0;

      if (
        !closeTriggered.current &&
        delta.y >= drawerHeight - drawerCloseOffset
      ) {
        closeTriggered.current = true;
        onCloseDrawer?.();
      }
    },
  });
  const drawerRef = React.useRef<HTMLElement>(null);
  const assignDrawerRef = React.useCallback(
    (element: HTMLElement | null) => {
      drawerRef.current = element;
      dragRef(element);
    },
    [dragRef],
  );

  return {
    isVisible: isItemVisible(id),
    drawerParentRef,
    drawerRef: assignDrawerRef,
    handleRef,
    dragStyle,
  };
};
