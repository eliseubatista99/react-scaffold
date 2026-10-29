import { ChangeEvent, useEffect, useRef } from "react";
import { InputFieldProps } from "./inputField";

export const useInputFieldHelper = (props: InputFieldProps) => {
  const debounceRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
    },
    [],
  );

  const onValueChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (!props.onChangeDelayInMilliseconds) {
      props.onChange?.(value);
      return;
    }

    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null;
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
