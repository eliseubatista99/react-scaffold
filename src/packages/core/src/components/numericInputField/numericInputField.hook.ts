import { useCallback, useRef } from "react";
import { InputFieldProps } from "../inputField";
import { NumericInputFieldProps } from "./numericInputField";

export const useNumericInputFieldHelper = (props: NumericInputFieldProps) => {
  const prevValue = useRef<string>("");

  const handleNegatives = useCallback(
    (val: string): string => {
      if (props.allowNegatives) {
        // Only allow one -
        val = val.replace(/-/g, (match, offset) => (offset === 0 ? "-" : ""));
        if (val.indexOf("-") > 0) {
          val = val.replace(/-/g, "");
          val = "-" + val;
        }
      } else {
        // remove all -
        val = val.replace(/-/g, "");
      }

      return val;
    },
    [props]
  );

  const handleDecimals = useCallback(
    (val: string) => {
      if (props.allowDecimals) {
        // If it starts with ".", make it "0."
        if (val.startsWith(".")) {
          val = "0" + val;
        }

        // If the first char is a minus, the second char cant be a dot
        if (val.length === 2 && val[0] === "-" && val[1] === ".") {
          val = "-";
        }

        // Only the first .
        const firstDot = val.indexOf(".");
        if (firstDot !== -1) {
          val =
            val.slice(0, firstDot + 1) +
            val.slice(firstDot + 1).replace(/\./g, "");
        }

        // Allow only one dot
        const [intPart, ...decParts] = val.split(".");
        const [_, ...prevDecParts] = prevValue.current.split(".");

        let decimal = decParts.join("");
        let prevDecimal = prevDecParts.join("");

        if (props.decimalScale !== undefined) {
          if (decimal.length > props.decimalScale) {
            decimal = prevDecimal;
          } else {
            decimal = decimal.slice(0, props.decimalScale);
          }
        }

        // Allow to end with dot
        val = decimal || val.endsWith(".") ? `${intPart}.${decimal}` : intPart;
      } else {
        val = val.replace(/\./g, "");
      }

      return val;
    },
    [props]
  );

  const handleMinAndMax = useCallback(
    (val: string) => {
      const num = Number(val);

      var maxFinal = props.max;

      if (maxFinal === undefined) {
        maxFinal = props.maxLength
          ? Number("9".repeat(props.maxLength))
          : undefined;
      }

      if (!isNaN(num)) {
        if (
          (props.min !== undefined && num < props.min) ||
          (maxFinal !== undefined && num > maxFinal)
        ) {
          return prevValue.current ?? val;
        }
      }
      return val;
    },
    [props]
  );

  const handleOnInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;

      // Memorize cursor position
      const selectionStart = target.selectionStart ?? 0;
      const selectionEnd = target.selectionEnd ?? 0;

      let val = target.value;

      val = val.replace(/[^0-9\.\-]/g, ""); // remove invalid chars

      val = handleNegatives(val);
      val = handleDecimals(val);
      val = handleMinAndMax(val);

      // Calculated the difference in length between the previous value and the new
      const diff = val.length - target.value.length;

      // Updates the input
      target.value = val;

      // Reposition the cursor
      target.setSelectionRange(selectionStart + diff, selectionEnd + diff);

      prevValue.current = val;
    },
    [handleNegatives, handleDecimals, handleMinAndMax]
  );

  const getManipulatedProps = useCallback((): InputFieldProps => {
    return {
      ...props,
      type: "text",
      pattern: "^-?[0-9]*.?[0-9]*$",
      onInput: handleOnInput,
    };
  }, [props, handleOnInput]);

  return {
    props: getManipulatedProps(),
  };
};
