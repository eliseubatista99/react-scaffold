import { FormFieldOutputData } from "../../types";

export class FormsHelper {
  static getField = (data: FormFieldOutputData[], name: string) => {
    const field = data.find((d) => d.name === name);

    if (!field) {
      return undefined;
    }

    return field;
  };

  static getFieldValue = <T>(
    field: FormFieldOutputData | undefined
  ): T | undefined => {
    if (!field || !field.value) {
      return undefined;
    }

    return field.value as T;
  };

  static getFieldValueOrDefault = <T>(
    field: FormFieldOutputData | undefined,
    defaultValue: T
  ): T => {
    const value = FormsHelper.getFieldValue<T>(field);

    if (!value) {
      return defaultValue;
    }

    return value;
  };
}
