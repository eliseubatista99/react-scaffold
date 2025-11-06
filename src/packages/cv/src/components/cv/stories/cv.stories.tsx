import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExampleCvContent } from "../../../resources";
import { CurriculumVitae } from "../cv";

const meta = {
  title: "CV/Components/CurriculumVitae",
  component: CurriculumVitae,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    data: ExampleCvContent,
    language: "en",
    template: "classic",
  },
} satisfies Meta<typeof CurriculumVitae>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Classic: Story = {
  args: {
    template: "classic",
  },
};

export const Modern: Story = {
  args: {
    template: "modern",
  },
};

export const Timeline: Story = {
  args: {
    template: "timeline",
  },
};

export const WithoutWrap: Story = {
  args: {
    template: "modern",
    pageConfigs: {
      wrap: false,
    },
  },
};
