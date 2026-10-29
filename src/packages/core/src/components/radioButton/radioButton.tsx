import React, { type CSSProperties } from "react";

export type RadioButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "aria-pressed"
> & {
  checked: boolean;
  customUncheckedRender?: React.ReactNode;
  customCheckedRender?: React.ReactNode;
  checkedStyles?: CSSProperties;
};

export const RadioButton = ({
  checked,
  style,
  checkedStyles,
  customCheckedRender,
  customUncheckedRender,
  ...buttonProps
}: RadioButtonProps) => {
  return (
    <button
      {...buttonProps}
      type="button"
      aria-pressed={checked}
      style={{
        padding: 0,
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        border: checked ? "2px solid #000000" : "2px solid #969696ff",
        background: checked ? "#000000" : "#ffffff",
        overflow: "hidden",
        objectFit: "contain",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        ...(checked ? checkedStyles : undefined),
        ...style,
      }}
    >
      {checked && (
        <>
          {!customCheckedRender && (
            <div
              style={{
                borderRadius: "50%",
                aspectRatio: "1/1",
                width: "40%",
                background: "#ffffff",
              }}
            />
          )}
          {customCheckedRender}
        </>
      )}
      {!checked && customUncheckedRender}
    </button>
  );
};
