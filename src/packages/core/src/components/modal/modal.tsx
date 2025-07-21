import React from "react";
import { useFeedback } from "../../providers";

export interface ModalProps {
  id: string;
  children?: React.ReactNode;
  backgroundStyles?: React.CSSProperties;
  contentStyles?: React.CSSProperties;
  onClickOutsideModal?: () => void;
}

export const Modal = ({
  id,
  children,
  backgroundStyles,
  contentStyles,
  onClickOutsideModal,
}: ModalProps) => {
  const { isItemVisible } = useFeedback();

  return (
    <>
      {isItemVisible(id) && (
        <div
          style={{
            width: "100vw",
            minHeight: "100vh",
            background: "#00000068",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            ...backgroundStyles,
          }}
          onClick={() => {
            onClickOutsideModal?.();
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "375px",
              height: "fit-content",
              minHeight: "80px",
              maxHeight: "50%",
              background: "#ffffff",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
              position: "relative",
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
