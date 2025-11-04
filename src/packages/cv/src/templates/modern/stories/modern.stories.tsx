import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExampleCvContent } from "../../../resources";
import { CVTemplateModern } from "../modern";

const meta = {
  title: "CV/Templates/Modern",
  component: CVTemplateModern,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    data: ExampleCvContent,
    language: "en",
  },
} satisfies Meta<typeof CVTemplateModern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
