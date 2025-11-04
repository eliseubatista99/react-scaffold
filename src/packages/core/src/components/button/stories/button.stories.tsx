import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";

const meta = {
  title: "Core/Components/Button",
  component: Button,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    children: "Button",
    onClick: () => alert("Button clicked"),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const XboxPrimary: Story = {
  args: {
    children: "Sign In",
    styles: {
      background: "#0f7441ff",
      color: "#ffffff",
      fontWeight: 600,
      fontSize: "16px",
      minWidth: "300px",
      textTransform: "uppercase",
      padding: "16px",
    },
  },
};

export const XboxSecondary: Story = {
  args: {
    children: "Log In",
    styles: {
      background: "#535b5fff",
      color: "#ffffff",
      fontWeight: 600,
      fontSize: "16px",
      minWidth: "300px",
      textTransform: "uppercase",
      padding: "16px",
    },
  },
};
