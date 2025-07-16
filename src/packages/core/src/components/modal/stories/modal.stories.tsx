import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "../modal";

const meta = {
  title: "Core/Components/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    backgroundStyles: {
      width: "600px",
      height: "600px",
    },
    children: <div>Hello</div>,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
