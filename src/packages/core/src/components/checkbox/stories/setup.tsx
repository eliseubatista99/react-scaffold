import { useState } from "react";
import { Checkbox, CheckboxProps } from "../checkbox";

export const CheckboxStoriesSetup = (props: CheckboxProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      {...props}
      checked={checked}
      onToggle={(state) => setChecked(state)}
    />
  );
};
