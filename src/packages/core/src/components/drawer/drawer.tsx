import React from "react";
import {
  useDialogAccessibility,
  type DialogAccessibleName,
} from "../dialog/useDialogAccessibility";
import { useDrawerHelper } from "./drawer.hook";

export interface DrawerHandleProps {
  render: React.ReactNode;
  style?: React.CSSProperties;
}

export type DrawerProps = DialogAccessibleName & {
  id: string;
  drawerCloseOffset?: number;
  children?: React.ReactNode;
  backgroundStyles?: React.CSSProperties;
  contentStyles?: React.CSSProperties;
  handle?: DrawerHandleProps;
  onCloseDrawer?: () => void;
};

export const Drawer = (props: DrawerProps) => {
  const {
    children,
    backgroundStyles,
    contentStyles,
    handle,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    onCloseDrawer,
  } = props;
  const {
    isVisible,
    drawerParentRef,
    drawerRef,
    handleRef,
    dragStyle,
  } = useDrawerHelper(props);
  const { dialogRef, handleKeyDown } = useDialogAccessibility(
    isVisible,
    onCloseDrawer,
  );
  const assignDialogRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      dialogRef.current = element;
      drawerRef(element);
    },
    [dialogRef, drawerRef],
  );

  return (
    <>
      {isVisible && (
        <div
          ref={drawerParentRef}
          style={{
            width: "auto",
            height: "auto",
            minHeight: "100vh",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: "#00000068",
            position: "fixed",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            ...backgroundStyles,
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onCloseDrawer?.();
            }
          }}
        >
          <div
            ref={assignDialogRef}
            id={props.id}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              height: "fit-content",
              minHeight: "80px",
              maxHeight: "90%",
              overflowY: "auto",
              background: "#ffffff",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              zIndex: 1001,
              position: "absolute",
              bottom: 0,
              ...contentStyles,
              ...dragStyle,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              ref={handleRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: "0px",
                height: "24px",
                width: "100%",
                cursor: "pointer",
                touchAction: "none",
                ...handle?.style,
              }}
            >
              {handle?.render}
            </div>

            {children}
          </div>
        </div>
      )}
    </>
  );
};
