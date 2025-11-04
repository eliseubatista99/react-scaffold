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

export const Default: Story = {
  args: {},
};

export const CustomBreakpoint: Story = {
  args: {
    breakpointConfiguration: {
      xs: 0,
      sm: 300,
      md: 320,
      lg: 340,
      xl: 360,
      xxl: 380,
    },
  },
};
