import React from "react";
import { useFeedback } from "../../providers";

export interface ToastProps {
  id: string;
  children?: React.ReactNode;
  styles?: React.CSSProperties;
  durationInSeconds?: number;
}

export const Toast = ({
  id,
  children,
  styles,
  durationInSeconds = 3,
}: ToastProps) => {
  const isVisibleCache = React.useRef<boolean>(false);
  const { isItemVisible, hideItem } = useFeedback();

  React.useEffect(() => {
    const isToastVisible = isItemVisible(id);

    if (isVisibleCache.current !== isToastVisible) {
      isVisibleCache.current = isToastVisible;

      if (isToastVisible) {
        setTimeout(() => hideItem(id), durationInSeconds * 1000);
      }
    }
  }, [isVisibleCache, isItemVisible, hideItem]);

  return (
    <>
      {isItemVisible(id) && (
        <div
          style={{
            width: "100px",
            height: "40px",
            background: "#534a4aff",
            color: "#ffffff",
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 3px #000000ff",
            ...styles,
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {children}
        </div>
      )}
    </>
  );
};
