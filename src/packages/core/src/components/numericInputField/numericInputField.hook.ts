import { useCallback, useRef } from "react";
import { InputFieldProps } from "../inputField";
import { NumericInputFieldProps } from "./numericInputField";

export const useNumericInputFieldHelper = (props: NumericInputFieldProps) => {
  const prevValue = useRef<string>("");

  function handleDecimals(val: string, decimalScale?: number): string {
    // Allow only one dot
    const [intPart, ...decParts] = val.split(".");
    const [_, ...prevDecParts] = prevValue.current.split(".");

    let decimal = decParts.join("");
    let prevDecimal = prevDecParts.join("");

    if (decimalScale !== undefined) {
      if (decimal.length > decimalScale) {
        decimal = prevDecimal;
      } else {
        decimal = decimal.slice(0, decimalScale);
      }
    }

    // Allow to end with dot
    return decimal || val.endsWith(".") ? `${intPart}.${decimal}` : intPart;
  }

  function handleMinAndMax(
    val: string,
    min?: number,
    max?: number,
    prevValue?: string
  ): string {
    const num = Number(val);
    if (!isNaN(num)) {
      if (
        (min !== undefined && num < min) ||
        (max !== undefined && num > max)
      ) {
        return prevValue ?? val;
      }
    }
    return val;
  }

  const handleOnInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    // Memorize cursor position
    const selectionStart = target.selectionStart ?? 0;
    const selectionEnd = target.selectionEnd ?? 0;

    let val = target.value;

    // Remove invalid chars
    const allowedChars = `0-9${props.allowDecimals ? "\\." : ""}${
      props.allowNegatives ? "\\-" : ""
    }`;
    val = val.replace(new RegExp(`[^${allowedChars}]`, "g"), "");

    val = handleDecimals(val, props.decimalScale);
    val = handleMinAndMax(val, props.min, props.max, prevValue.current);

    // Calculated the difference in length between the previous value and the new
    const diff = val.length - target.value.length;

    // Updates the input
    target.value = val;

    // Reposition the cursor
    target.setSelectionRange(selectionStart + diff, selectionEnd + diff);

    prevValue.current = val;
  };

  const getManipulatedProps = useCallback((): InputFieldProps => {
    return {
      ...props,
      type: "text",
      pattern: "^-?d*.?d*$",
      onInput: handleOnInput,
    };
  }, []);

  return {
    props: getManipulatedProps(),
  };
};
