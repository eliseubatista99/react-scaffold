import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollHelperStoriesSetup } from "./setup";

const meta = {
  title: "Core/Helpers/ScrollHelper",
  component: ScrollHelperStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof ScrollHelperStoriesSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
