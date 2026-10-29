import { InputField, type InputFieldProps } from "../inputField";
import { useNumericInputFieldHelper } from "./numericInputField.hook";

export type NumericInputFieldProps = Omit<
  InputFieldProps,
  "type" | "min" | "max" | "pattern"
> & {
  max?: number;
  min?: number;
  decimalScale?: number;
  allowDecimals?: boolean;
  allowNegatives?: boolean;
};

export const NumericInputField = ({
  allowNegatives = true,
  allowDecimals = true,
  decimalScale = 2,
  ...props
}: NumericInputFieldProps) => {
  const { props: manipulatedProps } = useNumericInputFieldHelper({
    allowNegatives,
    allowDecimals,
    decimalScale,
    ...props,
  });

  return <InputField {...manipulatedProps} />;
};
