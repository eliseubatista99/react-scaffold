import React from "react";
import { useFeedback } from "../../providers";
import {
  useDialogAccessibility,
  type DialogAccessibleName,
} from "../dialog/useDialogAccessibility";

export type ModalProps = DialogAccessibleName & {
  id: string;
  children?: React.ReactNode;
  backgroundStyles?: React.CSSProperties;
  contentStyles?: React.CSSProperties;
  onClickOutsideModal?: () => void;
};

export const Modal = ({
  id,
  children,
  backgroundStyles,
  contentStyles,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  onClickOutsideModal,
}: ModalProps) => {
  const { isItemVisible } = useFeedback();
  const isVisible = isItemVisible(id);
  const { dialogRef, handleKeyDown } = useDialogAccessibility(
    isVisible,
    onClickOutsideModal,
  );

  return (
    <>
      {isVisible && (
        <div
          style={{
            width: "auto",
            height: "auto",
            minHeight: "100vh",
            background: "#00000068",
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            ...backgroundStyles,
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClickOutsideModal?.();
            }
          }}
        >
          <div
            ref={dialogRef}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            style={{
              width: "90%",
              maxWidth: "375px",
              height: "fit-content",
              minHeight: "80px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
              position: "relative",
              padding: "24px",
              ...contentStyles,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};
