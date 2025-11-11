import type { Meta, StoryObj } from "@storybook/react-vite";
import { Carousel } from "../carousel";

const meta = {
  title: "Core/Components/Carousel",
  component: Carousel,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
