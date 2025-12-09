import React from "react";
import { FormFieldOutputData } from "../../types";
import { FormProps } from "./form";

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type runFetchOptions = Record<string, any>;

export type FormFieldValidation = (value: string) => string | undefined;

// export interface FormFieldOutput {
//   value?: string;
//   message?: string;
//   error?: boolean;
// }

// export type FormOutput = Record<string, FormFieldOutput>;

export const useFormHelper = ({ onSubmit, fields }: FormProps) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const getFieldsData = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      const inputs = Array.from(event.currentTarget.elements).filter(
        (
          el
        ): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
          !!el.getAttribute("name")
      );

      const result: FormFieldOutputData[] = [];

      for (const input of inputs) {
        const name = input.name;

        result.push({
          name,
          value: input.value,
        });
      }

      return result;
    },
    [onSubmit]
  );

  const handleSubmitForm = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      // Preventing the page from reloading
      event.preventDefault();
      event.stopPropagation();
      const result = getFieldsData(event);

      onSubmit?.(result);
    },
    [onSubmit]
  );

  const submitForm = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  //   <form onSubmit={handleSubmitForm}></form>;
  return {
    ref: formRef,
    submitForm,
    handleFormSubmission: handleSubmitForm,
  };
};
