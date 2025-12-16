type FormFieldUnknownValueValidation = {
  value: number;
  errorMessage: string;
};

type FormFieldNumericValidation = {
  value: number;
  errorMessage: string;
};

type FormFieldCustomValidation = (
  value: unknown
) => string | undefined | Promise<string | undefined>;

export interface FormFieldConfiguration {
  name: string;
  emptyValidation?: {
    allow: boolean;
    errorMessage: string;
  };
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
