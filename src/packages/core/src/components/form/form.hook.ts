import React, { useCallback } from "react";
import { useDidMount } from "../../hooks";
import { FormFieldOutputData } from "../../types";
import { FormProps } from "./form";

type FormMoment = "change" | "submit" | "mount";

export const useFormHelper = ({
  onPreSubmit,
  onSubmit,
  onChange,
  onMount,
  configurations,
}: FormProps) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const isSubmittingRef = React.useRef<boolean>(false);

  const getInputData = (
    input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ): FormFieldOutputData => {
    const name = input.name;

    return {
      name,
      value: input.value?.trim(),
    };
  };

  const getFieldsData = () => {
    if (!formRef.current?.elements) {
      return [];
    }

    const inputs = Array.from(formRef.current?.elements).filter(
      (el): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
        !!el.getAttribute("name"),
    );

    const result: FormFieldOutputData[] = [];

    for (const input of inputs) {
      result.push(getInputData(input));
    }

    return result;
  };

  const shouldValidateConfigurationOnMoment = (
    moment: FormMoment,
    configurationShouldValidateOnChange: boolean | null | undefined,
    configurationShouldValidateOnMount: boolean | null | undefined,
  ) => {
    return (
      (moment === "change" && configurationShouldValidateOnChange) ||
      (moment === "mount" && configurationShouldValidateOnMount) ||
      moment === "submit"
    );
  };

  const validateField = async (
    data: FormFieldOutputData,
    moment: FormMoment,
  ): Promise<FormFieldOutputData> => {
    try {
      const configuration = (configurations || []).find(
        (c) => c.name === data.name,
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
        !stringValue &&
        shouldValidateConfigurationOnMoment(
          moment,
          configuration.emptyValidation.validateOnChange,
          configuration.emptyValidation.validateOnMount,
        )
      ) {
        data.error = configuration.emptyValidation.errorMessage;
        return data;
      }

      //Min length validation
      if (
        configuration.minLengthValidation &&
        stringValue.length < configuration.minLengthValidation.value &&
        shouldValidateConfigurationOnMoment(
          moment,
          configuration.minLengthValidation.validateOnChange,
          configuration.minLengthValidation.validateOnMount,
        )
      ) {
        data.error = configuration.minLengthValidation.errorMessage;
        return data;
      }

      //Max length validation
      if (
        configuration.maxLengthValidation &&
        stringValue.length > configuration.maxLengthValidation.value &&
        shouldValidateConfigurationOnMoment(
          moment,
          configuration.maxLengthValidation.validateOnChange,
          configuration.maxLengthValidation.validateOnMount,
        )
      ) {
        data.error = configuration.maxLengthValidation.errorMessage;
        return data;
      }

      if (!isNaN(numericValue)) {
        //Min value validation
        if (
          configuration.minValueValidation &&
          numericValue < configuration.minValueValidation.value &&
          shouldValidateConfigurationOnMoment(
            moment,
            configuration.minValueValidation.validateOnChange,
            configuration.minValueValidation.validateOnMount,
          )
        ) {
          data.error = configuration.minValueValidation.errorMessage;
          return data;
        }

        //Max value validation
        if (
          configuration.maxValueValidation &&
          numericValue > configuration.maxValueValidation.value &&
          shouldValidateConfigurationOnMoment(
            moment,
            configuration.maxValueValidation.validateOnChange,
            configuration.maxValueValidation.validateOnMount,
          )
        ) {
          data.error = configuration.maxValueValidation.errorMessage;
          return data;
        }
      }

      //Exact value validation
      if (
        configuration.exactValueValidation &&
        configuration.exactValueValidation.value !== data.value &&
        shouldValidateConfigurationOnMoment(
          moment,
          configuration.exactValueValidation.validateOnChange,
          configuration.exactValueValidation.validateOnMount,
        )
      ) {
        data.error = configuration.exactValueValidation.errorMessage;
        return data;
      }

      for (let i = 0; i < (configuration.validations || []).length; i++) {
        const validationItem = configuration.validations?.[i];

        if (
          !shouldValidateConfigurationOnMoment(
            moment,
            validationItem?.validateOnChange,
            validationItem?.validateOnMount,
          )
        ) {
          continue;
        }

        const error = await configuration.validations?.[i].validate?.(
          data.value,
        );

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

  const validateAllFields = useCallback(async (moment: FormMoment) => {
    let result = getFieldsData();
    result = await Promise.all(
      result.map(async (res) => await validateField(res, moment)),
    );

    const fieldsWithErrors = result.find((i) => i.error !== undefined);

    return { fields: result, hasErrors: fieldsWithErrors !== undefined };
  }, []);

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
        const result = await validateAllFields("submit");

        isSubmittingRef.current = false;

        onSubmit?.(result.fields, result.hasErrors);
      } catch (e) {
        isSubmittingRef.current = false;
        console.error("Form > OnSubmit > Error submitting: ", e);
      }
    },
    [onSubmit, onPreSubmit],
  );

  const handleOnChange = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      try {
        const changedElement = event.target as HTMLInputElement;

        var allFieldsValidation = await validateAllFields("change");
        let result = getInputData(changedElement);

        result = await validateField(result, "change");

        console.debug("Form > On Change > ", { result, allFieldsValidation });

        onChange?.(
          result,
          allFieldsValidation.fields,
          allFieldsValidation.hasErrors,
        );
      } catch (e) {
        console.error("Form > onChange > Error changing: ", e);
      }
    },
    [onSubmit, onPreSubmit],
  );

  const handleOnMount = React.useCallback(async () => {
    try {
      const result = await validateAllFields("mount");

      onMount?.(result.fields, result.hasErrors);
    } catch (e) {
      console.error("Form > onChange > Error changing: ", e);
    }
  }, [onSubmit, onPreSubmit]);

  const submitForm = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  useDidMount(() => {
    handleOnMount();
  });

  //   <form onSubmit={handleSubmitForm}></form>;
  return {
    ref: formRef,
    submitForm,
    handleFormSubmission: handleSubmitForm,
    handleFormChange: handleOnChange,
  };
};
