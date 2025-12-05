import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumericInputField } from "../numericInputField";

const meta = {
  title: "Core/Components/Numeric Input Field",
  component: NumericInputField,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    name: "example-input-field",
    placeHolder: "This is an example input field",
    onFocus: () => {
      console.debug("NumericInputField > OnFocus");
    },
  },
} satisfies Meta<typeof NumericInputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithoutDecimals: Story = {
  args: {
    allowDecimals: false,
  },
};

export const WithoutNegatives: Story = {
  args: {
    allowNegatives: false,
  },
};

export const WithMinAndMax: Story = {
  args: {
    max: 9999,
    min: -9999,
  },
};
