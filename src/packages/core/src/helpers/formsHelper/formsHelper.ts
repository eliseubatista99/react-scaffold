import { FormFieldOutputData } from "../../types";

export class FormsHelper {
  static getField = <T>(
    data: FormFieldOutputData[],
    name: string
  ): T | undefined => {
    const field = data.find((d) => d.name === name);

    if (!field || !field.value) {
      return undefined;
    }

    return field.value as T;
  };
}
