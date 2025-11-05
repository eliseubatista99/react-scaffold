import type { Meta, StoryObj } from "@storybook/react-vite";

import { ExampleCvContent } from "../../../resources";
import { UseCVGeneratorStoriesSetup } from "./setup";

const meta = {
  title: "CV/Hooks/useCVGenerator",
  component: UseCVGeneratorStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    data: {
      template: "modern",
      data: ExampleCvContent,
    },
  },
} satisfies Meta<typeof UseCVGeneratorStoriesSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Classic: Story = {
  args: {
    data: {
      template: "classic",
      data: ExampleCvContent,
    },
  },
};

export const Modern: Story = {
  args: {
    data: {
      template: "modern",
      data: ExampleCvContent,
    },
  },
};

export const Timeline: Story = {
  args: {
    data: {
      template: "timeline",
      data: ExampleCvContent,
    },
  },
};
