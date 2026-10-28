import React from "react";

export type MousePositionData = {
  x?: number;
  y?: number;
};

export const usePointer = () => {
  const [pointerPosition, setMousePosition] = React.useState<MousePositionData>(
    {}
  );
  const [isPointerDown, setIsPointerDown] = React.useState(false);
  const activePointerId = React.useRef<number | null>(null);

  React.useEffect(() => {
    const updatePointerPosition = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      if (
        activePointerId.current !== null &&
        event.pointerId !== activePointerId.current
      ) {
        return;
      }

      setMousePosition((currentPosition) => {
        if (
          currentPosition.x === event.clientX &&
          currentPosition.y === event.clientY
        ) {
          return currentPosition;
        }

        return { x: event.clientX, y: event.clientY };
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || activePointerId.current !== null) return;

      activePointerId.current = event.pointerId;
      setIsPointerDown(true);
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId.current) return;

      activePointerId.current = null;
      setIsPointerDown(false);
    };

    window.addEventListener("pointermove", updatePointerPosition);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerEnd);
    window.addEventListener("pointercancel", onPointerEnd);
    return () => {
      window.removeEventListener("pointermove", updatePointerPosition);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
    };
  }, []);

  return {
    pointerPosition,
    isPointerDown,
  };
};
