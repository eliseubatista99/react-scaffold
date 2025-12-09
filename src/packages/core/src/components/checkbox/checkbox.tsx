import { type CSSProperties } from "react";

export type CheckboxProps = {
  name: string;
  checked?: boolean;
  label?: React.ReactNode;
  customUncheckedRender?: React.ReactNode;
  customCheckedRender?: React.ReactNode;
  onToggle?: (checked: boolean) => void;
  styles?: CSSProperties;
  checkboxStyles?: CSSProperties;
};

export const Checkbox = ({
  name,
  checked,
  onToggle,
  styles,
  label,
  checkboxStyles,
  customCheckedRender,
  customUncheckedRender,
}: CheckboxProps) => {
  return (
    <div
      style={{
        width: "fit-content",
        height: "fit-content",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        alignItems: "center",
        ...styles,
      }}
    >
      <div
        style={{
          width: "fit-content",
          height: "fit-content",
          position: "relative",
          display: "flex",
        }}
      >
        <input
          name={name}
          type="checkbox"
          onChange={(e) => {
            e.stopPropagation();
            onToggle?.(!checked);
          }}
          checked={checked}
          style={{
            appearance: "none",
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
            ...checkboxStyles,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {checked && customCheckedRender}
          {!checked && customUncheckedRender}
        </div>
      </div>
      {label}
    </div>
  );
};
