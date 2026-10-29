import styled from "@emotion/styled";
import React, { useId } from "react";
import { useInputFieldHelper } from "./inputField.hook";

export interface InputFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "name"
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "onFocus"
    | "onBlur"
    | "onClick"
    | "style"
  > {
  ref?: React.Ref<HTMLInputElement>;
  name: string;
  onChangeDelayInMilliseconds?: number;
  label?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bottomMessage?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  inputStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  style?: React.CSSProperties;
}

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  font-family: inherit;

  input:focus {
    border: none;
    outline: none;
    background: none;
  }

  > div:focus-within {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  input:autofill {
    background-color: #00000000;
  }

  input:-webkit-autofill {
    background-color: #00000000;
  }
`;

export const InputField = (props: InputFieldProps) => {
  const { onValueChanged, handleOnBlur, handleOnFocus, handleOnClick } =
    useInputFieldHelper(props);
  const generatedId = useId();

  const {
    ref,
    name,
    id,
    label,
    leftIcon,
    rightIcon,
    bottomMessage,
    placeholder,
    autoComplete = "off",
    value,
    initialValue,
    type = "text",
    maxLength,
    inputStyles,
    containerStyles,
    style,
    step,
    pattern,
    disabled,
    onChangeDelayInMilliseconds: _onChangeDelayInMilliseconds,
    onClick: _onClick,
    onInput,
    "aria-describedby": ariaDescribedBy,
    ...inputProps
  } = props;
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
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
      {hasLabel && <label htmlFor={inputId}>{label}</label>}
      <div
        onClick={() => handleOnClick()}
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "47px",
          margin: "8px auto 0 auto",
          border: "2px solid #000000",
          borderRadius: "5px",
          padding: "5px 15px",
          color: "#000000",
          fontFamily: "inherit",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "24px",
          outline: "none",
          alignItems: "center",
          gap: "10px",
          ...containerStyles,
        }}
      >
        {leftIcon}
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          autoComplete={autoComplete}
          step={step}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          defaultValue={initialValue}
          onChange={onValueChanged}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onInput={onInput}
          pattern={pattern}
          disabled={disabled}
          aria-describedby={
            hasBottomMessage
              ? [ariaDescribedBy, descriptionId].filter(Boolean).join(" ")
              : ariaDescribedBy
          }
          style={{
            flex: 1,
            border: "none",
            color: "inherit",
            fontFamily: "inherit",
            fontStyle: "inherit",
            fontWeight: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            outline: "inherit",
            background: "none",
            ...inputStyles,
          }}
        />
        {rightIcon}
      </div>

      {hasBottomMessage && (
        <div id={descriptionId}>{bottomMessage}</div>
      )}
    </ContainerDiv>
  );
};
