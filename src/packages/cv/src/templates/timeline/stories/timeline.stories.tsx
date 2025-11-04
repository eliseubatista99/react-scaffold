import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExampleCvContent } from "../../../resources";
import { CVTemplateTimeline } from "../timeline";

const meta = {
  title: "CV/Templates/Timeline",
  component: CVTemplateTimeline,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    data: ExampleCvContent,
    language: "en",
  },
} satisfies Meta<typeof CVTemplateTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
