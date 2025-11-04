import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loader } from "../loader";
import { LoaderStoriesSetup } from "./setup";

const meta = {
  title: "Core/Components/Loader",
  component: LoaderStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    id: "example-loader",
    styles: { background: "#000029" },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Opaque: Story = {
  args: {},
};

export const Transparent: Story = {
  args: {
    styles: { background: "#00000068" },
  },
};
