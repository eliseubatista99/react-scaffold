import { ChangeEvent, useCallback } from "react";
import { InputFieldProps } from "./inputField";

export const useInputFieldHelper = (props: InputFieldProps) => {
  const onValueChanged = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event.currentTarget.value);
  };

  const handleOnFocus = (
    event: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    props.onFocus?.();
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    props.onBlur?.();
  };

  const handleOnInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (props.type === "number") {
      const target = e.target as HTMLInputElement;
      //Only numbers
      target.value = target.value.replace(/[^0-9]/g, "");
    }
  };

  const getManipulatedProps = useCallback(() => {
    if (props.type === "number") {
      return {
        ...props,
        type: "text",
        pattern: "[0-9]*",
      };
    }

    return props;
  }, []);

  return {
    props: getManipulatedProps(),
    handleOnBlur,
    handleOnFocus,
    onValueChanged,
    handleOnInput,
  };
};
