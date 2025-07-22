import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextHelperStoriesSetup } from "./setup";

const meta = {
  title: "Core/Helpers/TextHelper",
  component: TextHelperStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    text1: "i aM a TexT",
    text2: "i Am A tEXt",
  },
} satisfies Meta<typeof TextHelperStoriesSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
