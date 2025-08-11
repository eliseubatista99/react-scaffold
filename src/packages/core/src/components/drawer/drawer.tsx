import React, { type CSSProperties } from "react";
import { useDrawerHelper } from "./drawer.hook";

export interface DrawerHandleProps {
  render: React.ReactNode;
  styles?: CSSProperties;
}

export interface DrawerProps {
  id: string;
  drawerCloseOffset?: number;
  children?: React.ReactNode;
  backgroundStyles?: CSSProperties;
  contentStyles?: CSSProperties;
  handle?: DrawerHandleProps;
  onCloseDrawer?: () => void;
}

export const Drawer = (props: DrawerProps) => {
  const { children, backgroundStyles, contentStyles, handle } = props;
  const {
    isVisible,
    drawerParentRef,
    drawerRef,
    handleRef,
    drawerBottomDistance,
  } = useDrawerHelper(props);

  return (
    <>
      {isVisible && (
        <div
          ref={drawerParentRef}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "100vh",
            left: 0,
            top: 0,
            background: "#00000068",
            position: "fixed",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            touchAction: "none",
            ...backgroundStyles,
          }}
        >
          <div
            ref={drawerRef}
            style={{
              width: "100%",
              height: "fit-content",
              minHeight: "80px",
              maxHeight: "90%",
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
              bottom: `${drawerBottomDistance}px`,
              ...contentStyles,
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
                ...handle?.styles,
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
