import React from "react";
import { FormFieldOutputData, FormProps } from "./form";

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
      var elementIds = Object.keys(event.currentTarget.elements);
      var elementValues = Object.values(event.currentTarget.elements);
      var result: FormFieldOutputData[] = [];

      for (let i = 0; i < elementIds.length; i++) {
        const key = elementIds[i];

        // only consider the elements specified in the fields input
        if (fields.findIndex((field) => field.name === key) === -1) {
          continue;
        }

        const value = (elementValues[i] as any).value;

        result.push({
          name: key,
          value,
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
      const result = getFieldsData(event);

      onSubmit?.(result);
    },
    [onSubmit]
  );

  const submitForm = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
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
