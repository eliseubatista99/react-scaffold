import React, { useCallback, useRef } from "react";
import { useDidMount } from "../../hooks";
import type { FormFieldOutputData } from "../../types";
import type { FormProps } from "./form";

type FormMoment = "change" | "submit" | "mount";
type FormControl =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

const getInputData = (input: FormControl): FormFieldOutputData => {
  if (input instanceof HTMLInputElement) {
    if (input.type === "checkbox") {
      return { name: input.name, value: input.checked };
    }

    if (input.type === "radio" && !input.checked) {
      return { name: input.name, value: undefined };
    }
  }

  if (input instanceof HTMLSelectElement && input.multiple) {
    return {
      name: input.name,
      value: Array.from(input.selectedOptions, (option) => option.value),
    };
  }

  return {
    name: input.name,
    value: input.value.trim(),
  };
};

const shouldValidateConfigurationOnMoment = (
  moment: FormMoment,
  configurationShouldValidateOnChange: boolean | null | undefined,
  configurationShouldValidateOnMount: boolean | null | undefined,
) =>
  (moment === "change" && configurationShouldValidateOnChange === true) ||
  (moment === "mount" && configurationShouldValidateOnMount === true) ||
  moment === "submit";

export const useFormHelper = ({
  onPreSubmit,
  onSubmit,
  onChange,
  onMount,
  configurations,
}: FormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmittingRef = useRef(false);
  const onMountRef = useRef(onMount);
  onMountRef.current = onMount;

  const getFieldsData = useCallback((): FormFieldOutputData[] => {
    if (!formRef.current) {
      return [];
    }

    const controls = Array.from(formRef.current.elements).filter(
      (element): element is FormControl =>
        (element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement) &&
        element.name.length > 0,
    );

    const radioGroups = new Map<
      string,
      { selected?: HTMLInputElement; first: HTMLInputElement }
    >();
    for (const control of controls) {
      if (control instanceof HTMLInputElement && control.type === "radio") {
        const group = radioGroups.get(control.name) ?? { first: control };
        if (control.checked) {
          group.selected = control;
        }
        radioGroups.set(control.name, group);
      }
    }

    return controls
      .filter(
        (control) =>
          !(control instanceof HTMLInputElement && control.type === "radio") ||
          radioGroups.get(control.name)?.selected === control ||
          (!radioGroups.get(control.name)?.selected &&
            radioGroups.get(control.name)?.first === control),
      )
      .map(getInputData);
  }, []);

  const validateField = useCallback(
    async (
      data: FormFieldOutputData,
      moment: FormMoment,
    ): Promise<FormFieldOutputData> => {
      const configuration = configurations?.find(
        (field) => field.name === data.name,
      );

      if (!configuration) {
        return data;
      }

      const stringValue =
        typeof data.value === "string"
          ? data.value
          : data.value === false || data.value == null
            ? ""
            : String(data.value);
      const numericValue =
        stringValue.trim() === "" ? Number.NaN : Number(stringValue);
      const hasNumericValue = Number.isFinite(numericValue);

      if (
        configuration.emptyValidation?.allow === false &&
        stringValue.length === 0 &&
        shouldValidateConfigurationOnMoment(
          moment,
          configuration.emptyValidation.validateOnChange,
          configuration.emptyValidation.validateOnMount,
        )
      ) {
        return { ...data, error: configuration.emptyValidation.errorMessage };
      }

      if (
        configuration.minLengthValidation &&
        stringValue.length < configuration.minLengthValidation.value &&
        shouldValidateConfigurationOnMoment(
          moment,
          configuration.minLengthValidation.validateOnChange,
          configuration.minLengthValidation.validateOnMount,
        )
      ) {
        return {
          ...data,
          error: configuration.minLengthValidation.errorMessage,
        };
      }

      if (
        configuration.maxLengthValidation &&
        stringValue.length > configuration.maxLengthValidation.value &&
        shouldValidateConfigurationOnMoment(
          moment,
          configuration.maxLengthValidation.validateOnChange,
          configuration.maxLengthValidation.validateOnMount,
        )
      ) {
        return {
          ...data,
          error: configuration.maxLengthValidation.errorMessage,
        };
      }

      if (hasNumericValue) {
        if (
          configuration.minValueValidation &&
          numericValue < configuration.minValueValidation.value &&
          shouldValidateConfigurationOnMoment(
            moment,
            configuration.minValueValidation.validateOnChange,
            configuration.minValueValidation.validateOnMount,
          )
        ) {
          return {
            ...data,
            error: configuration.minValueValidation.errorMessage,
          };
        }

        if (
          configuration.maxValueValidation &&
          numericValue > configuration.maxValueValidation.value &&
          shouldValidateConfigurationOnMoment(
            moment,
            configuration.maxValueValidation.validateOnChange,
            configuration.maxValueValidation.validateOnMount,
          )
        ) {
          return {
            ...data,
            error: configuration.maxValueValidation.errorMessage,
          };
        }
      }

      if (
        configuration.exactValueValidation &&
        shouldValidateConfigurationOnMoment(
          moment,
          configuration.exactValueValidation.validateOnChange,
          configuration.exactValueValidation.validateOnMount,
        )
      ) {
        const expectedValue = configuration.exactValueValidation.value;
        const matches =
          data.value === expectedValue ||
          (typeof data.value === "string" &&
            data.value.trim() !== "" &&
            Number.isFinite(Number(data.value)) &&
            Number(data.value) === expectedValue);

        if (!matches) {
          return {
            ...data,
            error: configuration.exactValueValidation.errorMessage,
          };
        }
      }

      for (const validation of configuration.validations ?? []) {
        if (
          !shouldValidateConfigurationOnMoment(
            moment,
            validation.validateOnChange,
            validation.validateOnMount,
          )
        ) {
          continue;
        }

        const error = await validation.validate(data.value);
        if (error) {
          return { ...data, error };
        }
      }

      return data;
    },
    [configurations],
  );

  const validateAllFields = useCallback(
    async (moment: FormMoment) => {
      const fields = await Promise.all(
        getFieldsData().map((field) => validateField(field, moment)),
      );

      return {
        fields,
        hasErrors: fields.some((field) => field.error !== undefined),
      };
    },
    [getFieldsData, validateField],
  );

  const handleSubmitForm = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;

      try {
        onPreSubmit?.();
        const result = await validateAllFields("submit");
        await onSubmit(result.fields, result.hasErrors);
      } catch (error) {
        console.error("Form > OnSubmit > Error submitting: ", error);
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [onPreSubmit, onSubmit, validateAllFields],
  );

  const handleOnChange = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      const target = event.target;
      if (
        !(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLTextAreaElement) &&
        !(target instanceof HTMLSelectElement)
      ) {
        return;
      }

      if (!target.name) {
        return;
      }

      try {
        const [result, allFieldsValidation] = await Promise.all([
          validateField(getInputData(target), "change"),
          validateAllFields("change"),
        ]);

        await onChange?.(
          result,
          allFieldsValidation.fields,
          allFieldsValidation.hasErrors,
        );
      } catch (error) {
        console.error("Form > onChange > Error changing: ", error);
      }
    },
    [onChange, validateAllFields, validateField],
  );

  const handleOnMount = useCallback(async () => {
    try {
      const result = await validateAllFields("mount");
      await onMountRef.current?.(result.fields, result.hasErrors);
    } catch (error) {
      console.error("Form > onMount > Error validating: ", error);
    }
  }, [validateAllFields]);

  useDidMount(() => {
    void handleOnMount();
  });

  return {
    ref: formRef,
    handleFormSubmission: handleSubmitForm,
    handleFormChange: handleOnChange,
  };
};
