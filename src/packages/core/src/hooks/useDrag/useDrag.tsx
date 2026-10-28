import React from "react";

export interface DragPosition {
  x: number;
  y: number;
}

export interface DragData {
  position: DragPosition;
  delta: DragPosition;
  isDragging: boolean;
}

export type DragAxis = "both" | "x" | "y";

export interface UseDragInput {
  axis?: DragAxis;
  bounds?: boolean;
  resetOnDragEnd?: boolean;
  onDragStart?: (data: DragData) => void;
  onDrag?: (data: DragData) => void;
  onDragEnd?: (data: DragData) => void;
}

export interface UseDragOutput {
  ref: React.RefCallback<HTMLElement>;
  containerRef: React.RefCallback<HTMLElement>;
  handleRef: React.RefCallback<HTMLElement>;
  position: DragPosition | null;
  isDragging: boolean;
  style: React.CSSProperties;
}

interface ActiveDrag {
  pointerId: number;
  startPointer: DragPosition;
  startPosition: DragPosition;
  startTranslation: DragPosition;
  position: DragPosition;
  delta: DragPosition;
}

const zeroPosition: DragPosition = { x: 0, y: 0 };

const getPositionWithinContainer = (
  element: HTMLElement,
  container: HTMLElement,
): DragPosition => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x:
      elementRect.left -
      containerRect.left -
      container.clientLeft +
      container.scrollLeft,
    y:
      elementRect.top -
      containerRect.top -
      container.clientTop +
      container.scrollTop,
  };
};

const limitPositionToContainer = (
  position: DragPosition,
  element: HTMLElement,
  container: HTMLElement,
): DragPosition => {
  const maxX =
    container.scrollLeft +
    Math.max(0, container.clientWidth - element.getBoundingClientRect().width);
  const maxY =
    container.scrollTop +
    Math.max(
      0,
      container.clientHeight - element.getBoundingClientRect().height,
    );

  return {
    x: Math.min(Math.max(position.x, container.scrollLeft), maxX),
    y: Math.min(Math.max(position.y, container.scrollTop), maxY),
  };
};

export const useDrag = ({
  axis = "both",
  bounds = true,
  resetOnDragEnd = false,
  onDragStart,
  onDrag,
  onDragEnd,
}: UseDragInput = {}): UseDragOutput => {
  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const [handle, setHandle] = React.useState<HTMLElement | null>(null);
  const [position, setPosition] = React.useState<DragPosition | null>(null);
  const [translation, setTranslation] =
    React.useState<DragPosition>(zeroPosition);
  const [isDragging, setIsDragging] = React.useState(false);

  const activeDragRef = React.useRef<ActiveDrag | null>(null);
  const translationRef = React.useRef(zeroPosition);
  const configurationRef = React.useRef({ axis, bounds, resetOnDragEnd });
  const callbacksRef = React.useRef({ onDragStart, onDrag, onDragEnd });

  configurationRef.current = { axis, bounds, resetOnDragEnd };
  callbacksRef.current = { onDragStart, onDrag, onDragEnd };

  const ref = React.useCallback<React.RefCallback<HTMLElement>>((node) => {
    setElement(node);
  }, []);

  const containerRef = React.useCallback<React.RefCallback<HTMLElement>>(
    (node) => {
      setContainer(node);
    },
    [],
  );

  const handleRef = React.useCallback<React.RefCallback<HTMLElement>>(
    (node) => {
      setHandle(node);
    },
    [],
  );

  const limitPosition = React.useCallback(
    (
      nextPosition: DragPosition,
      target: HTMLElement,
      boundsElement: HTMLElement | null,
    ): DragPosition => {
      if (!configurationRef.current.bounds || !boundsElement) {
        return nextPosition;
      }

      return limitPositionToContainer(nextPosition, target, boundsElement);
    },
    [],
  );

  React.useEffect(() => {
    if (!element) return;

    const boundsElement = container ?? element.parentElement;
    setPosition(
      boundsElement
        ? getPositionWithinContainer(element, boundsElement)
        : {
            x: element.getBoundingClientRect().left,
            y: element.getBoundingClientRect().top,
          },
    );
  }, [container, element]);

  React.useEffect(() => {
    if (!element) return;

    const dragHandle = handle ?? element;
    const previousTouchAction = dragHandle.style.touchAction;

    const startDrag = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || activeDragRef.current) {
        return;
      }

      const boundsElement = container ?? element.parentElement;
      const currentPosition = boundsElement
        ? getPositionWithinContainer(element, boundsElement)
        : {
            x: element.getBoundingClientRect().left,
            y: element.getBoundingClientRect().top,
          };
      const boundedPosition = limitPosition(
        currentPosition,
        element,
        boundsElement,
      );
      const startTranslation = translationRef.current;
      const boundedTranslation = {
        x: startTranslation.x + boundedPosition.x - currentPosition.x,
        y: startTranslation.y + boundedPosition.y - currentPosition.y,
      };
      const drag: ActiveDrag = {
        pointerId: event.pointerId,
        startPointer: { x: event.clientX, y: event.clientY },
        startPosition: boundedPosition,
        startTranslation: boundedTranslation,
        position: boundedPosition,
        delta: zeroPosition,
      };

      event.preventDefault();
      activeDragRef.current = drag;
      translationRef.current = boundedTranslation;
      setPosition(boundedPosition);
      setTranslation(boundedTranslation);
      setIsDragging(true);
      callbacksRef.current.onDragStart?.({
        position: boundedPosition,
        delta: zeroPosition,
        isDragging: true,
      });
    };

    dragHandle.style.touchAction = "none";
    dragHandle.addEventListener("pointerdown", startDrag);

    return () => {
      dragHandle.removeEventListener("pointerdown", startDrag);
      dragHandle.style.touchAction = previousTouchAction;
      activeDragRef.current = null;
      setIsDragging(false);
    };
  }, [container, element, handle, limitPosition]);

  React.useEffect(() => {
    const moveDrag = (event: PointerEvent) => {
      const activeDrag = activeDragRef.current;
      const target = element;
      if (!activeDrag || !target || event.pointerId !== activeDrag.pointerId) {
        return;
      }

      const boundsElement = container ?? target.parentElement;
      const { axis: activeAxis } = configurationRef.current;
      const pointerDelta = {
        x:
          activeAxis === "y"
            ? 0
            : event.clientX - activeDrag.startPointer.x,
        y:
          activeAxis === "x"
            ? 0
            : event.clientY - activeDrag.startPointer.y,
      };
      const nextPosition = limitPosition(
        {
          x: activeDrag.startPosition.x + pointerDelta.x,
          y: activeDrag.startPosition.y + pointerDelta.y,
        },
        target,
        boundsElement,
      );
      const delta = {
        x: nextPosition.x - activeDrag.startPosition.x,
        y: nextPosition.y - activeDrag.startPosition.y,
      };
      const nextTranslation = {
        x: activeDrag.startTranslation.x + delta.x,
        y: activeDrag.startTranslation.y + delta.y,
      };

      activeDrag.position = nextPosition;
      activeDrag.delta = delta;
      translationRef.current = nextTranslation;
      setPosition(nextPosition);
      setTranslation(nextTranslation);
      callbacksRef.current.onDrag?.({
        position: nextPosition,
        delta,
        isDragging: true,
      });
    };

    const endDrag = (event?: PointerEvent) => {
      const activeDrag = activeDragRef.current;
      if (
        !activeDrag ||
        (event && event.pointerId !== activeDrag.pointerId)
      ) {
        return;
      }

      activeDragRef.current = null;
      if (configurationRef.current.resetOnDragEnd) {
        translationRef.current = activeDrag.startTranslation;
        setTranslation(activeDrag.startTranslation);
        setPosition(activeDrag.startPosition);
      }
      setIsDragging(false);
      callbacksRef.current.onDragEnd?.({
        position: activeDrag.position,
        delta: activeDrag.delta,
        isDragging: false,
      });
    };

    const cancelDrag = () => endDrag();

    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("blur", cancelDrag);

    return () => {
      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("blur", cancelDrag);
    };
  }, [container, element, limitPosition]);

  return {
    ref,
    containerRef,
    handleRef,
    position,
    isDragging,
    style: {
      transform: `translate3d(${translation.x}px, ${translation.y}px, 0)`,
      cursor: isDragging ? "grabbing" : "grab",
    },
  };
};
