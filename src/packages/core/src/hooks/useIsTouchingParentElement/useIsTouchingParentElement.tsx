import React, { RefObject } from "react";
import { TimeHelper } from "../../helpers/timeHelper";

export const useIsTouchingParentElement = (
  elementRef: RefObject<Element | null>,
  offset = 0
) => {
  const elemHeightCached = React.useRef(0);
  const [scrolledAmount, setScrolledAmount] = React.useState(0);
  const currentElement = React.useRef<Element>(null);
  const [forceUpdate, setForceUpdate] = React.useState(false);

  const refresh = React.useCallback(() => {
    setForceUpdate((prev) => !prev);
  }, []);

  // eslint-disable-next-line sonarjs/no-identical-functions
  const isTouchingBottom = React.useCallback(() => {
    if (elemHeightCached.current === 0) {
      return false;
    }

    return scrolledAmount >= elemHeightCached.current - offset;
  }, [offset, scrolledAmount]);

  const isRefValid = React.useCallback(() => {
    return elementRef.current !== null && elementRef.current !== undefined;
  }, [elementRef]);

  React.useEffect(() => {
    if (forceUpdate) {
      //just to add dependency
    }

    const onScroll = () => {
      if (!elementRef.current) return;

      const elemHeight =
        elementRef.current.scrollHeight - elementRef.current.clientHeight;
      elemHeightCached.current = elemHeight;

      setScrolledAmount(elementRef.current.scrollTop);
    };
    const initializeHook = async () => {
      await TimeHelper.waitForCondition(isRefValid);
      currentElement.current = elementRef.current;
      currentElement.current?.addEventListener("scroll", onScroll);
    };
    initializeHook();
    return () => {
      currentElement.current?.removeEventListener("scroll", onScroll);
    };
  }, [
    elementRef,
    elemHeightCached,
    setScrolledAmount,
    scrolledAmount,
    isRefValid,
    forceUpdate,
  ]);

  return {
    isTouchingBottom: isTouchingBottom(),
    refresh,
  };
};
