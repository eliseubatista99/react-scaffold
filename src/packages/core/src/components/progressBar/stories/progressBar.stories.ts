import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "../progressBar";

const meta = {
  title: "Core/Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    percentage: 70,
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
