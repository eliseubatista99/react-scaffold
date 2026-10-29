import styled from "@emotion/styled";
import React, { useId } from "react";

export interface TextAreaFieldProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    | "name"
    | "value"
    | "defaultValue"
    | "onChange"
    | "onFocus"
    | "onBlur"
    | "style"
  > {
  ref?: React.Ref<HTMLTextAreaElement>;
  name: string;
  label?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bottomMessage?: React.ReactNode;
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  inputStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  style?: React.CSSProperties;
}

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  font-family: inherit;

  > div:focus-within {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  textarea::-webkit-scrollbar {
    width: 5px;
  }

  textarea::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
  }

  textarea::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  textarea::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const TextAreaField = ({
  ref,
  name,
  id,
  label,
  leftIcon,
  rightIcon,
  bottomMessage,
  value,
  initialValue,
  onChange,
  onFocus,
  onBlur,
  inputStyles,
  containerStyles,
  style,
  "aria-describedby": ariaDescribedBy,
  ...textareaProps
}: TextAreaFieldProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const descriptionId = `${textareaId}-description`;
  const hasLabel = label !== undefined && label !== null && label !== false;
  const hasBottomMessage =
    bottomMessage !== undefined &&
    bottomMessage !== null &&
    bottomMessage !== false;

  return (
    <ContainerDiv
      style={{
        width: "100%",
        maxWidth: "357px",
        gap: "8px",
        ...style,
      }}
    >
      {hasLabel && <label htmlFor={textareaId}>{label}</label>}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          margin: "8px auto 0 auto",
          border: "2px solid #000000",
          borderRadius: "5px",
          color: "#000000",
          fontFamily: "inherit",
          fontStyle: "normal",
          fontWeight: 400,
          alignItems: "flex-start",
          gap: "10px",
          ...containerStyles,
        }}
      >
        {leftIcon}
        <textarea
          {...textareaProps}
          ref={ref}
          id={textareaId}
          name={name}
          style={{
            resize: "none",
            flex: 1,
            border: "none",
            color: "inherit",
            fontFamily: "inherit",
            fontStyle: "inherit",
            fontWeight: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            background: "none",
            minHeight: "47px",
            ...inputStyles,
          }}
          value={value}
          defaultValue={value === undefined ? initialValue : undefined}
          onChange={(event) => onChange?.(event.currentTarget.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-describedby={
            hasBottomMessage
              ? [ariaDescribedBy, descriptionId].filter(Boolean).join(" ")
              : ariaDescribedBy
          }
        />
        {rightIcon}
      </div>

      {hasBottomMessage && (
        <div id={descriptionId}>{bottomMessage}</div>
      )}
    </ContainerDiv>
  );
};
