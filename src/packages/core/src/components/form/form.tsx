import styled from "@emotion/styled";
import React from "react";
import { FormFieldConfiguration, FormFieldOutputData } from "../../types";
import { useFormHelper } from "./form.hook";

export interface FormSubmitButton {
  styles?: React.CSSProperties;
  content: React.ReactNode;
}

export interface FormProps {
  children?: React.ReactNode;
  configurations?: FormFieldConfiguration[];
  submitButton: FormSubmitButton;
  onPreSubmit?: () => void;
  onSubmit: (data: FormFieldOutputData[]) => Promise<void>;
  styles?: React.CSSProperties;
  childrenStyles?: React.CSSProperties;
}

const SubmitButton = styled.div<{ styles?: React.CSSProperties }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  margin: 0;
  padding: 0;

  ${({ styles }) => styles && { ...styles }}

  > * {
    pointer-events: none;
  }
`;

export const Form = (props: FormProps) => {
  const { children, styles, childrenStyles, submitButton } = props;
  const { ref, handleFormSubmission, submitForm } = useFormHelper(props);

  return (
    <form
      ref={ref}
      onSubmit={handleFormSubmission}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flex: 1,
        ...styles,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
          ...childrenStyles,
        }}
      >
        {children}
      </div>
      <SubmitButton
        onClick={submitForm}
        styles={{
          ...submitButton.styles,
        }}
      >
        {submitButton.content}
      </SubmitButton>
    </form>
  );
};
