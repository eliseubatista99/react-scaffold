import styled from "@emotion/styled";
import React from "react";
import { FormFieldOutputData } from "../../types";
import { useFormHelper } from "./form.hook";

export interface FormFieldInputData {
  name: string;
  content: JSX.Element;
}

export interface FormSubmitButton {
  styles?: React.CSSProperties;
  content: React.ReactNode;
}

export interface FormProps {
  fields: {
    list: FormFieldInputData[];
    styles?: React.CSSProperties;
  };
  submitButton: FormSubmitButton;
  onSubmit: (data: FormFieldOutputData[]) => void;
  styles?: React.CSSProperties;
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
  const { fields, styles, submitButton } = props;
  const { ref, handleFormSubmission, submitForm } = useFormHelper(props);

  const mapFields = React.useCallback(() => {
    return fields.list.map((f): JSX.Element => {
      return { ...f.content, key: f.name };
    });
  }, [fields]);

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
          ...fields.styles,
        }}
      >
        {mapFields()}
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
