import { ChangeEvent } from "react";
import { InputFieldProps } from "./inputField";

export const useInputFieldHelper = (props: InputFieldProps) => {
  const onValueChanged = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event.currentTarget.value);
  };

  const handleOnFocus = (
    event: React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    props.onFocus?.();
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    props.onBlur?.();
  };

  const handleOnClick = (event: React.MouseEvent<HTMLInputElement>) => {
    props.onClick?.();
  };

  return {
    handleOnBlur,
    handleOnFocus,
    onValueChanged,
    handleOnClick,
  };
};
