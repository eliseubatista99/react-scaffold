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

export const ClassicPT: Story = {
  args: {
    template: "classic",
    language: "pt",
  },
};

export const Modern: Story = {
  args: {
    template: "modern",
  },
};

export const ModernPT: Story = {
  args: {
    template: "modern",
    language: "pt",
  },
};

export const Timeline: Story = {
  args: {
    template: "timeline",
  },
};

export const TimelinePT: Story = {
  args: {
    template: "timeline",
    language: "pt",
  },
};
