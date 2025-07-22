import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "../modal";
import { ModalStoriesSetup } from "./setup";

const meta = {
  title: "Core/Components/Modal",
  component: ModalStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    id: "example-modal",
    children: <div>Hello</div>,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
