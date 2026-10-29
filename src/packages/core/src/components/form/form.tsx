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

const hasInteractiveContent = (content: React.ReactNode): boolean =>
  React.Children.toArray(content).some((child) => {
    if (
      !React.isValidElement<{
        children?: React.ReactNode;
        onClick?: unknown;
        role?: string;
        tabIndex?: number;
      }>(child)
    ) {
      return false;
    }

    if (child.type === React.Fragment) {
      return hasInteractiveContent(child.props.children);
    }

    if (typeof child.type !== "string") {
      return true;
    }

    return (
      ["a", "button", "input", "select", "summary", "textarea"].includes(
        child.type,
      ) ||
      child.props.onClick !== undefined ||
      child.props.role === "button" ||
      child.props.tabIndex !== undefined ||
      hasInteractiveContent(child.props.children)
    );
  });

export const Form = (props: FormProps) => {
  const { children, style, childrenStyles, submitSection } = props;
  const { ref, handleFormSubmission, handleFormChange } = useFormHelper(props);
  const shouldAvoidButtonWrapper = hasInteractiveContent(
    submitSection.submitButton.content,
  );
  const submitButtonStyle = {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    margin: 0,
    padding: 0,
    ...submitSection.submitButton.style,
  } satisfies React.CSSProperties;

  const handleSubmitContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) {
      return;
    }

    const target = event.target;
    if (target instanceof Element) {
      const submitControl = target.closest("button, input");
      if (
        (submitControl instanceof HTMLButtonElement &&
          submitControl.type === "submit") ||
        (submitControl instanceof HTMLInputElement &&
          ["submit", "image"].includes(submitControl.type))
      ) {
        return;
      }
    }

    ref.current?.requestSubmit();
  };

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
        {shouldAvoidButtonWrapper ? (
          <div
            onClick={handleSubmitContentClick}
            style={submitButtonStyle}
          >
            {submitSection.submitButton.content}
          </div>
        ) : (
          <button type="submit" style={submitButtonStyle}>
            {submitSection.submitButton.content}
          </button>
        )}
        {submitSection.renderAfterSubmitButton}
      </div>
    </form>
  );
};
