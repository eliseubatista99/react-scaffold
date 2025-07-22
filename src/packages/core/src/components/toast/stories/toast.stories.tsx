import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast } from "../toast";
import { ToastStoriesSetup } from "./setup";

const meta = {
  title: "Core/Components/Toast",
  component: ToastStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    id: "example-toast",
    children: <div>Hello</div>,
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

export const WithCustomStyles: Story = {
  args: {
    styles: {
      background: "red",
    },
  },
};
