import React from "react";
import { MousePositionData, usePointer } from "../usePointer";

export interface DragData {
  startPosX?: number;
  startPosY?: number;
  posX?: number;
  posY?: number;
  distanceX?: number;
  distanceY?: number;
  isDragging: boolean;
}

export interface UseDragInput {
  ref?: React.RefObject<HTMLDivElement | null>;
  onDragStart?: (data: DragData) => void;
  onDrag?: (data: DragData) => void;
  onDragEnd?: (data: DragData) => void;
}

export const useDrag = ({
  ref,
  onDrag,
  onDragStart,
  onDragEnd,
}: UseDragInput) => {
  const isInitialized = React.useRef<boolean>(false);
  const isPointerDownCache = React.useRef<boolean>(false);
  const { pointerPosition, isPointerDown } = usePointer();

  const dragDataRef = React.useRef<DragData>({
    isDragging: false,
  });

  const calculateDragData = React.useCallback(
    (pointerPos: MousePositionData) => {
      if (!ref || !ref.current || !dragDataRef.current) {
        return undefined;
      }

      const result: DragData = { ...dragDataRef.current };

      //Y position of the pointer
      result.posY = pointerPos.y;
      result.posX = pointerPos.x;

      if (dragDataRef.current.startPosX && dragDataRef.current.posX) {
        result.distanceX =
          dragDataRef.current.startPosX - dragDataRef.current.posX;
      }

      if (dragDataRef.current.startPosY && dragDataRef.current.posY) {
        result.distanceY = -(
          dragDataRef.current.startPosY - dragDataRef.current.posY
        );
      }

      return result;
    },
    []
  );

  const handleOnClick = React.useCallback(
    (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragDataRef.current.isDragging = true;
      dragDataRef.current.startPosY = e.clientY;
      dragDataRef.current.startPosX = e.clientX;

      const dragDataResult = calculateDragData({ x: e.clientX, y: e.clientY });

      if (dragDataResult) {
        dragDataRef.current = dragDataResult;

        onDragStart?.(dragDataResult);
      }
    },
    [calculateDragData]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOnPointerUp = React.useCallback(
    (_?: PointerEvent) => {
      dragDataRef.current.isDragging = false;

      const dragDataResult = calculateDragData(pointerPosition);

      if (dragDataResult) {
        onDragEnd?.(dragDataResult);

        dragDataResult.startPosX = undefined;
        dragDataResult.startPosY = undefined;

        dragDataRef.current = dragDataResult;
      }
    },
    [calculateDragData, pointerPosition]
  );

  const handleOnPointerMove = React.useCallback(
    (_?: PointerEvent) => {
      console.debug(
        "useDrag > onPointerMove > Is Dragging >",
        dragDataRef.current.isDragging
      );

      if (!dragDataRef.current.isDragging) {
        return;
      }

      const dragDataResult = calculateDragData(pointerPosition);

      console.debug("useDrag > onPointerMove > Drag Result >", dragDataResult);

      if (dragDataResult) {
        onDrag?.(dragDataResult);

        dragDataRef.current = dragDataResult;
      }
    },
    [calculateDragData, pointerPosition]
  );

  const initializeDrag = React.useCallback(async () => {
    if (isInitialized.current) {
      return;
    }

    while (!ref?.current) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    isInitialized.current = true;
    ref.current.onpointerdown = handleOnClick;
    ref.current.style.touchAction = "none";
  }, [ref?.current, handleOnClick]);

  React.useEffect(() => {
    initializeDrag();
  }, [initializeDrag]);

  React.useEffect(() => {
    handleOnPointerMove();
  }, [pointerPosition]);

  React.useEffect(() => {
    if (isPointerDown !== isPointerDownCache.current) {
      isPointerDownCache.current = isPointerDown;

      if (!isPointerDown) {
        handleOnPointerUp();
      }
    }
  }, [isPointerDown, isPointerDownCache.current]);
};
