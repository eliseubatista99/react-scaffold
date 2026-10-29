import React from "react";
import type {
  FormFieldConfiguration,
  FormFieldOutputData,
} from "../../types";
import { useFormHelper } from "./form.hook";

export interface FormSubmitButton {
  style?: React.CSSProperties;
  content: React.ReactNode;
}

export interface FormSubmitSection {
  renderBeforeSubmitButton?: React.ReactNode;
  submitButton: FormSubmitButton;
  renderAfterSubmitButton?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface FormProps {
  children?: React.ReactNode;
  configurations?: FormFieldConfiguration[];
  submitSection: FormSubmitSection;
  onMount?: (data: FormFieldOutputData[], hasErrors?: boolean) => Promise<void>;
  onPreSubmit?: () => void;
  onSubmit: (data: FormFieldOutputData[], hasErrors?: boolean) => Promise<void>;
  onChange?: (
    changedField: FormFieldOutputData,
    data: FormFieldOutputData[],
    hasErrors?: boolean,
  ) => Promise<void>;
  style?: React.CSSProperties;
  childrenStyles?: React.CSSProperties;
}

export const Form = (props: FormProps) => {
  const { children, style, childrenStyles, submitSection } = props;
  const { ref, handleFormSubmission, handleFormChange } = useFormHelper(props);

  return (
    <form
      ref={ref}
      onSubmit={handleFormSubmission}
      onChange={handleFormChange}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flex: 1,
        ...style,
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
      <div
        data-testid="submit-section"
        style={{
          width: "100%",
          flexDirection: "row",
          gap: "10px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          ...submitSection.style,
        }}
      >
        {submitSection.renderBeforeSubmitButton}
        <button
          type="submit"
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            margin: 0,
            padding: 0,
            ...submitSection.submitButton.style,
          }}
        >
          {submitSection.submitButton.content}
        </button>
        {submitSection.renderAfterSubmitButton}
      </div>
    </form>
  );
};
