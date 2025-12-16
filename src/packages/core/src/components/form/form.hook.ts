import React from "react";
import { FormFieldOutputData } from "../../types";
import { FormProps } from "./form";

export const useFormHelper = ({
  onPreSubmit,
  onSubmit,
  configurations,
}: FormProps) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const isSubmittingRef = React.useRef<boolean>(false);

  const getFieldsData = (event: React.FormEvent<HTMLFormElement>) => {
    const inputs = Array.from(event.currentTarget.elements).filter(
      (el): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
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
  };

  const validateField = async (
    data: FormFieldOutputData
  ): Promise<FormFieldOutputData> => {
    try {
      const configuration = (configurations || []).find(
        (c) => c.name === data.name
      );

      if (!configuration) {
        return data;
      }

      var stringValue = data.value as string;
      var numericValue = data.value as number;

      //Empty validation
      if (
        configuration.emptyValidation &&
        configuration.emptyValidation.allow === false &&
        !stringValue
      ) {
        data.error = configuration.emptyValidation.errorMessage;
        return data;
      }

      //Min length validation
      if (
        configuration.minLengthValidation &&
        stringValue.length < configuration.minLengthValidation.value
      ) {
        data.error = configuration.minLengthValidation.errorMessage;
        return data;
      }

      //Max length validation
      if (
        configuration.maxLengthValidation &&
        stringValue.length > configuration.maxLengthValidation.value
      ) {
        data.error = configuration.maxLengthValidation.errorMessage;
        return data;
      }

      if (!isNaN(numericValue)) {
        //Min value validation
        if (
          configuration.minValueValidation &&
          numericValue < configuration.minValueValidation.value
        ) {
          data.error = configuration.minValueValidation.errorMessage;
          return data;
        }

        //Max value validation
        if (
          configuration.maxValueValidation &&
          numericValue > configuration.maxValueValidation.value
        ) {
          data.error = configuration.maxValueValidation.errorMessage;
          return data;
        }
      }

      //Exact value validation
      if (
        configuration.exactValueValidation &&
        configuration.exactValueValidation.value !== data.value
      ) {
        data.error = configuration.exactValueValidation.errorMessage;
        return data;
      }

      for (let i = 0; i < (configuration.validations || []).length; i++) {
        const error = await configuration.validations?.[i](data.value);

        if (error) {
          data.error = error;
          return data;
        }
      }
    } catch (e) {
      console.error(`Form > Failed To Validate Field ${data.name}: `, e);
    }

    return data;
  };

  const handleSubmitForm = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      try {
        if (isSubmittingRef.current) {
          return;
        }

        isSubmittingRef.current = true;

        onPreSubmit?.();

        // Preventing the page from reloading
        event.preventDefault();
        event.stopPropagation();
        let result = getFieldsData(event);

        result = await Promise.all(
          result.map(async (res) => await validateField(res))
        );

        isSubmittingRef.current = false;

        onSubmit?.(result);
      } catch (e) {
        isSubmittingRef.current = false;
        console.error("Form > OnSubmit > Error submitting: ", e);
      }
    },
    [onSubmit, onPreSubmit]
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
