import styled from "@emotion/styled";
import type React from "react";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "defaultChecked" | "onChange" | "onToggle" | "style"
> & {
  name: string;
  checked?: boolean;
  label?: React.ReactNode;
  customUncheckedRender?: React.ReactNode;
  customCheckedRender?: React.ReactNode;
  onToggle?: (checked: boolean) => void;
  style?: React.CSSProperties;
  checkboxStyles?: React.CSSProperties;
};

const CheckboxContainer = styled.label`
  input:focus-visible + span {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }
`;

export const Checkbox = ({
  name,
  checked = false,
  onToggle,
  style,
  label,
  checkboxStyles,
  customCheckedRender,
  customUncheckedRender,
  ...inputProps
}: CheckboxProps) => {
  return (
    <CheckboxContainer
      style={{
        width: "fit-content",
        height: "fit-content",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        alignItems: "center",
        ...style,
      }}
    >
      <input
        {...inputProps}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(event) => onToggle?.(event.currentTarget.checked)}
        style={{
          position: "absolute",
          opacity: 0,
          width: "25px",
          height: "25px",
          margin: 0,
          cursor: "pointer",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          width: "25px",
          height: "25px",
          flexShrink: 0,
          borderRadius: "4px",
          border: "1px solid #969696ff",
          background: checked ? "#000" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          ...checkboxStyles,
        }}
      >
        {checked && customCheckedRender}
        {!checked && customUncheckedRender}
      </span>
      {label}
    </CheckboxContainer>
  );
};
