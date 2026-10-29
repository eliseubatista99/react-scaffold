import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  style,
  type = "button",
  ...buttonProps
}: ButtonProps) => {
  return (
    <button
      {...buttonProps}
      type={type}
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
        ...style,
      }}
    >
      {children}
    </button>
  );
};
