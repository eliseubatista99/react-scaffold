import type { Meta, StoryObj } from "@storybook/react-vite";
import { useResponsive } from "../useResponsive";
import { UseResponsiveStoriesSetup } from "./setup";

const meta = {
  title: "Core/Hooks/useResponsive",
  component: UseResponsiveStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof useResponsive>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JsonPlaceholder: Story = {
  args: {},
};
