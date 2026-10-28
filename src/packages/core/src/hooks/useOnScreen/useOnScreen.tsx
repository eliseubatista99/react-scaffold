import React, { useState, type RefObject } from "react";

export function useOnScreen(ref: RefObject<HTMLElement | null>) {
  const [isIntersecting, setIntersecting] = useState(false);
  const [target, setTarget] = useState(ref.current);

  React.useEffect(() => {
    setTarget(ref.current);
  });

  React.useEffect(() => {
    if (!target || typeof IntersectionObserver === "undefined") {
      setIntersecting(false);
      return;
    }

    let isActive = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (isActive) {
        setIntersecting(entry.isIntersecting);
      }
    });

    setIntersecting(false);
    observer.observe(target);

    return () => {
      isActive = false;
      observer.disconnect();
    };
  }, [target]);

  return isIntersecting;
}
