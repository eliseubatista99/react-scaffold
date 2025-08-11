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

  React.useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    const onPointerDown = (_: MouseEvent) => {
      setIsPointerDown(true);
    };

    const onPointerUp = (_: MouseEvent) => {
      setIsPointerDown(false);
    };

    window.addEventListener("pointermove", updateMousePosition);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", updateMousePosition);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return {
    pointerPosition,
    isPointerDown,
  };
};
