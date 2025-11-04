import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExampleCvContent } from "../../../resources";
import { CVTemplateCreative } from "../creative";

const meta = {
  title: "CV/Templates/Creative",
  component: CVTemplateCreative,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    data: ExampleCvContent,
    language: "en",
  },
} satisfies Meta<typeof CVTemplateCreative>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
