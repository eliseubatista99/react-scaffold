import React from "react";
import { useFormHelper } from "./form.hook";

export interface FormFieldOutputData {
  name: string;
  value?: unknown;
}

export interface FormFieldInputData {
  name: string;
  content: JSX.Element;
}

export interface FormSubmitButton {
  styles?: React.CSSProperties;
  content: React.ReactNode;
}

export interface FormProps {
  fields: FormFieldInputData[];
  submitButton: FormSubmitButton;
  onSubmit: (data: FormFieldOutputData[]) => void;
  styles?: React.CSSProperties;
}

export const Form = (props: FormProps) => {
  const { fields, styles, submitButton } = props;
  const { ref, handleFormSubmission, submitForm } = useFormHelper(props);

  const mapFields = React.useCallback(() => {
    return fields.map((f): JSX.Element => {
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
      {mapFields()}
      <div
        onClick={submitForm}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          ...submitButton.styles,
        }}
      >
        {submitButton.content}
      </div>
    </form>
  );
};
