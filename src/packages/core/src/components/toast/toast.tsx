import React from "react";
import { useFeedback } from "../../providers";

export interface ToastProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "id" | "style" | "role" | "aria-live" | "aria-atomic"
  > {
  id: string;
  style?: React.CSSProperties;
  durationInSeconds?: number;
  role?: React.AriaRole;
  "aria-live"?: React.AriaAttributes["aria-live"];
  "aria-atomic"?: React.AriaAttributes["aria-atomic"];
}

export const Toast = ({
  id,
  children,
  style,
  durationInSeconds = 3,
  role = "status",
  "aria-live": ariaLive = "polite",
  "aria-atomic": ariaAtomic = true,
  ...toastProps
}: ToastProps) => {
  const { isItemVisible, hideItem } = useFeedback();
  const isVisible = isItemVisible(id);

  React.useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => hideItem(id),
      durationInSeconds * 1000,
    );

    return () => window.clearTimeout(timeoutId);
  }, [durationInSeconds, hideItem, id, isVisible]);

  return (
    <>
      {isVisible && (
        <div
          {...toastProps}
          role={role}
          aria-live={ariaLive}
          aria-atomic={ariaAtomic}
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
            ...style,
          }}
        >
          {children}
        </div>
      )}
    </>
  );
};
