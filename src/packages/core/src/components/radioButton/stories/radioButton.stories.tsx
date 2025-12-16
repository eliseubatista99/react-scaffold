import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioButton } from "../radioButton";

const meta = {
  title: "Core/Components/Radio Button",
  component: RadioButton,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    checked: false,
    styles: { width: "50px", height: "50px" },
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
