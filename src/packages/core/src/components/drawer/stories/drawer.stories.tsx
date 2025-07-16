import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer } from "../drawer";

const meta = {
  title: "Core/Components/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    children: <div>Hello</div>,
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

export const WithCustomHandle: Story = {
  args: {
    handle: {
      render: (
        <div
          style={{
            width: "30px",
            height: "3px",
            background: "#00000f",
            borderRadius: "10px",
          }}
        />
      ),
    },
  },
};

export const WithCustomOverlay: Story = {
  args: {
    backgroundStyles: {
      background: "#5e43d436",
    },
  },
};

export const WithCustomContentStyles: Story = {
  args: {
    contentStyles: {
      background: "#5e43d436",
    },
  },
};
