import { useEffect, useRef } from "react";
import type { InputFieldProps } from "../inputField";
import type { NumericInputFieldProps } from "./numericInputField";

const sanitizeNumericValue = (
  value: string,
  allowDecimals: boolean,
  allowNegatives: boolean,
  decimalScale: number,
) => {
  let sanitized = value.replace(/[^0-9.-]/g, "");
  const isNegative = allowNegatives && sanitized.startsWith("-");
  sanitized = sanitized.replace(/-/g, "");

  if (!allowDecimals) {
    sanitized = sanitized.replace(/\./g, "");
  } else {
    const decimalIndex = sanitized.indexOf(".");
    if (decimalIndex !== -1) {
      const integerPart = sanitized.slice(0, decimalIndex);
      const decimalPart = sanitized
        .slice(decimalIndex + 1)
        .replace(/\./g, "")
        .slice(0, decimalScale);
      sanitized = `${integerPart || "0"}.${decimalPart}`;
    }
  }

  return `${isNegative ? "-" : ""}${sanitized}`;
};

const getNumericPattern = (
  allowDecimals: boolean,
  allowNegatives: boolean,
  decimalScale: number,
) => {
  const signPattern = allowNegatives ? "-?" : "";

  if (!allowDecimals || decimalScale === 0) {
    return `^${signPattern}[0-9]+$`;
  }

  return `^${signPattern}(?:[0-9]+(?:\\.[0-9]{0,${decimalScale}})?|\\.[0-9]{1,${decimalScale}})$`;
};

export const useNumericInputFieldHelper = (props: NumericInputFieldProps) => {
  const {
    allowDecimals = true,
    allowNegatives = true,
    decimalScale = 2,
    min,
    max,
    maxLength,
    value,
    initialValue,
    onInput,
  } = props;
  const effectiveDecimalScale = Number.isFinite(decimalScale)
    ? Math.max(0, Math.floor(decimalScale))
    : 0;
  const previousValue = useRef(value ?? initialValue ?? "");

  useEffect(() => {
    previousValue.current = value ?? initialValue ?? "";
  }, [initialValue, value]);

  const handleOnInput: NonNullable<InputFieldProps["onInput"]> = (event) => {
    const input = event.currentTarget;
    const rawValue = input.value;
    const selectionStart = input.selectionStart ?? rawValue.length;
    const selectionEnd = input.selectionEnd ?? rawValue.length;
    let nextValue = sanitizeNumericValue(
      rawValue,
      allowDecimals,
      allowNegatives,
      effectiveDecimalScale,
    );

    const numericValue =
      nextValue === "" || nextValue === "-"
        ? Number.NaN
        : Number(nextValue);
    const effectiveMax =
      max ??
      (maxLength && maxLength > 0
        ? Number("9".repeat(maxLength))
        : undefined);

    if (
      Number.isFinite(numericValue) &&
      ((min !== undefined && numericValue < min) ||
        (effectiveMax !== undefined && numericValue > effectiveMax))
    ) {
      nextValue = previousValue.current;
    } else {
      previousValue.current = nextValue;
    }

    const sanitizedSelectionStart = sanitizeNumericValue(
      rawValue.slice(0, selectionStart),
      allowDecimals,
      allowNegatives,
      effectiveDecimalScale,
    ).length;
    const sanitizedSelectionEnd = sanitizeNumericValue(
      rawValue.slice(0, selectionEnd),
      allowDecimals,
      allowNegatives,
      effectiveDecimalScale,
    ).length;

    input.value = nextValue;
    input.setSelectionRange(
      Math.min(sanitizedSelectionStart, nextValue.length),
      Math.min(sanitizedSelectionEnd, nextValue.length),
    );

    onInput?.(event);
  };

  const {
    allowDecimals: _allowDecimals,
    allowNegatives: _allowNegatives,
    decimalScale: _decimalScale,
    min: _min,
    max: _max,
    ...inputProps
  } = props;

  return {
    props: {
      ...inputProps,
      type: "text" as const,
      inputMode:
        inputProps.inputMode ??
        (allowDecimals && effectiveDecimalScale > 0 ? "decimal" : "numeric"),
      pattern: getNumericPattern(
        allowDecimals,
        allowNegatives,
        effectiveDecimalScale,
      ),
      onInput: handleOnInput,
    },
  };
};
