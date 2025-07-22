import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "../typography";

const meta = {
  title: "Core/Components/Typography",
  component: Typography,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    overflowEllipsis: false,
    children:
      "Forms have different stats. If Aegislash's ability is stance change, it changes to Blade Forme before using a damaging move, and reverts to Shield Forme before using King's Shield or upon leaving the field.",
    styles: { maxWidth: "200px" },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};

export const WithEllipsis: Story = {
  args: {
    overflowEllipsis: true,
  },
};

export const WithCustomStyles: Story = {
  args: {
    styles: {
      background: "#c10521",
    },
  },
};
