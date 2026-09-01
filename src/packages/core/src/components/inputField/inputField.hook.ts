import { ChangeEvent, useRef } from "react";
import { InputFieldProps } from "./inputField";

export const useInputFieldHelper = (props: InputFieldProps) => {
  const debounceRef = useRef<number | null>(null);

  const onValueChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    // If there is no delay
    if (!props.onChangeDelayInMilliseconds) {
      props.onChange?.(value);
      return;
    }

    // Clear timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Create new timer
    debounceRef.current = window.setTimeout(() => {
      props.onChange?.(value);
    }, props.onChangeDelayInMilliseconds);
  };

  const handleOnFocus = (
    event: React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    props.onFocus?.();
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    props.onBlur?.();
  };

  const handleOnClick = () => {
    props.onClick?.();
  };

  return {
    handleOnBlur,
    handleOnFocus,
    onValueChanged,
    handleOnClick,
  };
};
