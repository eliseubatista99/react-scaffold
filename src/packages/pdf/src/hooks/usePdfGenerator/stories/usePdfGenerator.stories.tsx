import type { Meta, StoryObj } from "@storybook/react-vite";

import { UsePdfGeneratorStoriesSetup } from "./setup";
import { ViteHomepage } from "./viteHomepage";

const meta = {
  title: "Pdf/Hooks/usePdfGenerator",
  component: UsePdfGeneratorStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    fileName: "test.pdf",
    content: <ViteHomepage />,
  },
} satisfies Meta<typeof UsePdfGeneratorStoriesSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
