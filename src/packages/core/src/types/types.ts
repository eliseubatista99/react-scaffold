type FormFieldBaseValidation = {
  validateOnChange?: boolean;
  validateOnMount?: boolean;
};

type FormFieldUnknownValueValidation = FormFieldBaseValidation & {
  value: number;
  errorMessage: string;
};

type FormFieldNumericValidation = FormFieldBaseValidation & {
  value: number;
  errorMessage: string;
};

type FormFieldEmptyValidation = FormFieldBaseValidation & {
  allow: boolean;
  errorMessage: string;
};

type FormFieldCustomValidation = FormFieldBaseValidation & {
  validate: (
    value: unknown,
  ) => string | undefined | Promise<string | undefined>;
};

export interface FormFieldConfiguration {
  name: string;
  emptyValidation?: FormFieldEmptyValidation;
  minLengthValidation?: FormFieldNumericValidation;
  maxLengthValidation?: FormFieldNumericValidation;
  minValueValidation?: FormFieldNumericValidation;
  maxValueValidation?: FormFieldNumericValidation;
  exactValueValidation?: FormFieldUnknownValueValidation;
  validations?: FormFieldCustomValidation[];
}

export interface FormFieldInputData {
  name: string;
  configuration?: FormFieldConfiguration;
  content: JSX.Element;
}

export interface FormFieldOutputData {
  name: string;
  value?: unknown;
  error?: string;
}
