import type { Meta, StoryObj } from "@storybook/react-vite";

import { FeedbackProvider } from "../feedbackProvider";
import { FeedbackStoriesSetup } from "./setup";

const meta = {
  title: "Core/Providers/Feedback Provider",
  component: FeedbackStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof FeedbackProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};
