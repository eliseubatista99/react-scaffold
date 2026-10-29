import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioButton } from "../radioButton";
import { RadioButtonStoriesSetup } from "./setup";

const meta = {
  title: "Core/Components/Radio Button",
  component: RadioButtonStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    checked: false,
    "aria-label": "Select option",
    style: { width: "50px", height: "50px" },
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};
