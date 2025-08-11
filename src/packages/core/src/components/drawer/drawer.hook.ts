import React from "react";
import { DragData, useDrag } from "../../hooks";
import { useFeedback } from "../../providers";
import type { DrawerProps } from "./drawer";

export const useDrawerHelper = ({
  id,
  onCloseDrawer,
  drawerCloseOffset = 15,
}: DrawerProps) => {
  const { isItemVisible } = useFeedback();

  const [dragData, setDragData] = React.useState<DragData>({
    isDragging: false,
  });

  const drawerParentRef = React.useRef<HTMLDivElement>(null);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = React.useRef<HTMLDivElement>(null);
  const [drawerBottomDistance, setDrawerBottomDistance] =
    React.useState<number>(0);

  const handleOnClick = (data: DragData) => {
    setDragData(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOnPointerUp = (data: DragData) => {
    setDragData(data);
    setDrawerBottomDistance(0);
  };

  const handleOnPointerMove = (data: DragData) => {
    setDragData(data);

    const drawerHeight = drawerRef.current?.clientHeight || 0;

    if (data.distanceY) {
      //Set the drawer bottom distance. In case the pointer moved up, cap it to zero
      setDrawerBottomDistance(data.distanceY < 0 ? 0 : -data.distanceY);

      if (data.distanceY >= drawerHeight - drawerCloseOffset) {
        onCloseDrawer?.();
        handleOnPointerUp(data);
      }
    }
  };

  useDrag({
    ref: handleRef,
    onDrag: handleOnPointerMove,
    onDragEnd: handleOnPointerUp,
    onDragStart: handleOnClick,
  });

  return {
    isVisible: isItemVisible(id),
    drawerParentRef,
    drawerRef,
    drawerBottomDistance,
    handleRef,
  };
};
