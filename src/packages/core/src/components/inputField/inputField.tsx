import styled from "@emotion/styled";
import {
  HTMLInputAutoCompleteAttribute,
  type CSSProperties,
  type HTMLInputTypeAttribute,
} from "react";
import { useInputFieldHelper } from "./inputField.hook";

export interface InputFieldProps {
  name: string;
  label?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bottomMessage?: React.ReactNode;
  step?: string | number;
  placeHolder?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  value?: string;
  initialValue?: string;
  pattern?: string;
  maxLength?: number;
  type?: HTMLInputTypeAttribute;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputStyles?: CSSProperties;
  containerStyles?: CSSProperties;
  styles?: CSSProperties;
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

  input:autofill {
    background-color: #00000000;
  }

  input:-webkit-autofill {
    background-color: #00000000;
  }
`;

export const InputField = (props: InputFieldProps) => {
  const { onValueChanged, handleOnBlur, handleOnFocus } =
    useInputFieldHelper(props);

  const {
    name,
    label,
    leftIcon,
    rightIcon,
    bottomMessage,
    placeHolder,
    autoComplete = "off",
    value,
    initialValue,
    type = "text",
    maxLength,
    inputStyles,
    containerStyles,
    styles,
    step,
    pattern,
    onInput,
  } = props;

  return (
    <ContainerDiv
      style={{
        width: "100%",
        maxWidth: "357px",
        gap: "8px",
        ...styles,
      }}
    >
      {label}
      <div
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
          name={name}
          type={type}
          autoComplete={autoComplete}
          step={step}
          maxLength={maxLength}
          placeholder={placeHolder}
          value={value}
          defaultValue={initialValue}
          onChange={onValueChanged}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onInput={onInput}
          pattern={pattern}
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

      {bottomMessage}
    </ContainerDiv>
  );
};
