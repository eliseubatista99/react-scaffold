import { useState } from "react";
import { RadioButton, type RadioButtonProps } from "../radioButton";

export const RadioButtonStoriesSetup = (props: RadioButtonProps) => {
  const [checked, setChecked] = useState(props.checked);

  return (
    <RadioButton
      {...props}
      checked={checked}
      onClick={(event) => {
        props.onClick?.(event);
        setChecked((current) => !current);
      }}
    />
  );
};
