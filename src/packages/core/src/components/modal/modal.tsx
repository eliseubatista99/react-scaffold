import React from "react";

export interface ModalProps {
  isVisible: boolean;
  children?: React.ReactNode;
  backgroundStyles?: React.CSSProperties;
  contentStyles?: React.CSSProperties;
  onClickOutsideModal: () => void;
}

export const Modal = ({
  isVisible,
  children,
  backgroundStyles,
  contentStyles,
  onClickOutsideModal,
}: ModalProps) => {
  return (
    <>
      {isVisible && (
        <div
          style={{
            width: "100%",
            minHeight: "100%",
            left: 0,
            top: 0,
            background: "#00000068",
            position: "absolute",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            ...backgroundStyles,
          }}
          onClick={() => {
            onClickOutsideModal();
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "375px",
              height: "fit-content",
              maxHeight: "50%",
              background: "#ffffff",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
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
