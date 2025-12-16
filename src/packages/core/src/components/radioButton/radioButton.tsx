import { type CSSProperties } from "react";

export type RadioButtonProps = {
  checked: boolean;
  customUncheckedRender?: React.ReactNode;
  customCheckedRender?: React.ReactNode;
  onClick?: () => void;
  styles?: CSSProperties;
  checkedStyles?: CSSProperties;
};

export const RadioButton = ({
  checked,
  onClick,
  styles,
  checkedStyles,
  customCheckedRender,
  customUncheckedRender,
}: RadioButtonProps) => {
  const finalStyles: React.CSSProperties = checked
    ? { ...styles, ...checkedStyles }
    : { ...styles };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      style={{
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
        ...finalStyles,
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
    </div>
  );
};
