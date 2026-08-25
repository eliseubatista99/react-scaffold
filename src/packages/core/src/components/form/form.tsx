import styled from "@emotion/styled";
import React from "react";
import { FormFieldConfiguration, FormFieldOutputData } from "../../types";
import { useFormHelper } from "./form.hook";

export interface FormSubmitButton {
  styles?: React.CSSProperties;
  content: React.ReactNode;
}

export interface FormSubmitSection {
  renderBeforeSubmitButton?: React.ReactNode;
  submitButton: FormSubmitButton;
  renderAfterSubmitButton?: React.ReactNode;
  styles?: React.CSSProperties;
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
  styles?: React.CSSProperties;
  childrenStyles?: React.CSSProperties;
}

const SubmitButton = styled.div<{ styles?: React.CSSProperties }>`
  display: flex;
  flex: 1;
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
  const { children, styles, childrenStyles, submitSection } = props;
  const { ref, handleFormSubmission, submitForm, handleFormChange } =
    useFormHelper(props);

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
          ...submitSection.styles,
        }}
      >
        {submitSection.renderBeforeSubmitButton}
        <SubmitButton
          onClick={submitForm}
          styles={{
            ...submitSection.submitButton.styles,
          }}
        >
          {submitSection.submitButton.content}
        </SubmitButton>
        {submitSection.renderAfterSubmitButton}
      </div>
    </form>
  );
};
