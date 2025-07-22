import type { Meta, StoryObj } from "@storybook/react-vite";
import fileExample from "./example.pdf";
import { PdfRendererStoriesSetup } from "./setup";
const meta = {
  title: "Pdf/Components/PdfRenderer",
  component: PdfRendererStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    file: fileExample,
    currentPage: undefined,
  },
} satisfies Meta<typeof PdfRendererStoriesSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};

export const Paginated: Story = {
  args: { currentPage: 1 },
};
