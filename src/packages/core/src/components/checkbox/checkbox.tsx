import { type CSSProperties } from "react";

export type CheckboxProps = {
  checked: boolean;
  customUncheckedRender?: React.ReactNode;
  customCheckedRender?: React.ReactNode;
  onToggle?: (checked: boolean) => void;
  styles?: CSSProperties;
  checkedStyles?: CSSProperties;
};

export const Checkbox = ({
  checked,
  onToggle,
  styles,
  customCheckedRender,
  customUncheckedRender,
}: CheckboxProps) => {
  return (
    <div
      onClick={() => onToggle?.(!checked)}
      style={{
        width: "25px",
        height: "25px",
        borderRadius: "4px",
        border: "1px solid #969696ff",
        background: checked ? "#000000" : "#ffffff",
        overflow: "hidden",
        objectFit: "contain",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        ...styles,
      }}
    >
      {checked && customCheckedRender}
      {!checked && customUncheckedRender}
    </div>
  );
};
