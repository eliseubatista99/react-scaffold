import type { Meta, StoryObj } from "@storybook/react-vite";

import { FeedbackProvider } from "../feedbackProvider";
import { exampleModal, exampleToast, FeedbackStoriesSetup } from "./setup";

const meta = {
  title: "Core/Providers/Feedback Provider",
  component: FeedbackStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    items: [
      {
        id: "example-modal",
        type: "modal",
        content: exampleModal,
      },
      {
        id: "example-toast",
        type: "toast",
        content: exampleToast,
      },
    ],
  },
} satisfies Meta<typeof FeedbackProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};
