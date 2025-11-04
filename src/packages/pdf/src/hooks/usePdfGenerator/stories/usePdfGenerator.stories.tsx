import type { Meta, StoryObj } from "@storybook/react-vite";

import { PdfGeneratorExampleContent } from "./exampleContent";
import { UsePdfGeneratorStoriesSetup } from "./setup";

const meta = {
  title: "Pdf/Hooks/usePdfGenerator",
  component: UsePdfGeneratorStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    fileName: "test.pdf",
    content: <PdfGeneratorExampleContent />,
  },
} satisfies Meta<typeof UsePdfGeneratorStoriesSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
