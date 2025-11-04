import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExampleCvContent } from "../../../resources";
import { CVTemplateMinimal } from "../minimal";

const meta = {
  title: "CV/Templates/Minimal",
  component: CVTemplateMinimal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    data: ExampleCvContent,
    language: "en",
  },
} satisfies Meta<typeof CVTemplateMinimal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
