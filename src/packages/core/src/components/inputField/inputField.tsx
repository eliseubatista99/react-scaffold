import styled from "@emotion/styled";
import {
  HTMLInputAutoCompleteAttribute,
  type ChangeEvent,
  type CSSProperties,
  type HTMLInputTypeAttribute,
} from "react";

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
  type?: HTMLInputTypeAttribute;
  onChange?: (value: string) => void;
  inputStyles?: CSSProperties;
  containerProps?: CSSProperties;
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

export const InputField = ({
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
  onChange,
  inputStyles,
  containerProps,
  step,
}: InputFieldProps) => {
  const onValueChanged = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.currentTarget.value);
  };

  return (
    <ContainerDiv
      style={{
        width: "100%",
        maxWidth: "357px",
        gap: "8px",
        ...containerProps,
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
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: "24px",
          outline: "none",
          alignItems: "center",
          gap: "10px",
          ...inputStyles,
        }}
      >
        {leftIcon}
        <input
          name={name}
          type={type}
          autoComplete={autoComplete}
          step={step}
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
          }}
          placeholder={placeHolder}
          value={value}
          defaultValue={initialValue}
          onChange={onValueChanged}
        />
        {rightIcon}
      </div>

      {bottomMessage}
    </ContainerDiv>
  );
};
