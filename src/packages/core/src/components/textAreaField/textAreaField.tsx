import styled from "@emotion/styled";
import { type ChangeEvent, type CSSProperties } from "react";

export interface TextAreaFieldProps {
  name: string;
  label?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bottomMessage?: React.ReactNode;
  placeHolder?: string;
  value?: string;
  initialValue?: string;
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

  textarea::-webkit-scrollbar {
    width: 5px; /* largura da barra */
  }

  textarea::-webkit-scrollbar-track {
    background: #f0f0f0; /* fundo */
    border-radius: 10px;
  }

  textarea::-webkit-scrollbar-thumb {
    background: #888; /* cor da barra */
    border-radius: 10px;
  }

  textarea::-webkit-scrollbar-thumb:hover {
    background: #555; /* hover */
  }
`;

export const TextAreaField = ({
  name,
  label,
  leftIcon,
  rightIcon,
  bottomMessage,
  placeHolder,
  value,
  initialValue,
  onChange,
  onFocus,
  onBlur,
  inputStyles,
  containerStyles,
  styles,
}: TextAreaFieldProps) => {
  const onValueChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event.currentTarget.value);
  };

  const handleOnFocus = (
    event: React.FocusEvent<HTMLTextAreaElement, Element>,
  ) => {
    onFocus?.();
  };

  const handleOnBlur = (
    event: React.FocusEvent<HTMLTextAreaElement, Element>,
  ) => {
    onBlur?.();
  };

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
          margin: "8px auto 0 auto",
          border: "2px solid #000000",
          borderRadius: "5px",
          color: "#000000",
          fontFamily: "inherit",
          fontStyle: "normal",
          fontWeight: 400,
          outline: "none",
          alignItems: "flex-start",
          gap: "10px",
          ...containerStyles,
        }}
      >
        {leftIcon}
        <textarea
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
            outline: "inherit",
            background: "none",
            minHeight: "47px",
            ...inputStyles,
          }}
          placeholder={placeHolder}
          value={value}
          defaultValue={initialValue}
          onChange={onValueChanged}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
        {rightIcon}
      </div>

      {bottomMessage}
    </ContainerDiv>
  );
};
