import type { Meta, StoryObj } from "@storybook/react-vite";

import { PdfHelperStoriesSetup } from "./setup";

const meta = {
  title: "Pdf/Helpers/PdfHelper",
  component: PdfHelperStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof PdfHelperStoriesSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
