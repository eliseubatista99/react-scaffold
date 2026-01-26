import React, { type CSSProperties } from "react";

export type ButtonProps = {
  onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactNode;
  styles?: CSSProperties;
};

export const Button = ({ children, onClick, styles }: ButtonProps) => {
  return (
    <button
      style={{
        border: "none",
        borderRadius: "1000px",
        background: "#d6d6d6ff",
        padding: "12px 18px",
        fontSize: "16px",
        width: "fit-content",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "row",
        ...styles,
      }}
      onClick={(e) => {
        onClick?.(e);
      }}
    >
      {children}
    </button>
  );
};
