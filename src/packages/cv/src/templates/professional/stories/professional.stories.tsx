import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExampleCvContent } from "../../../resources";
import { CVTemplateProfessional } from "../professional";

const meta = {
  title: "CV/Templates/Professional",
  component: CVTemplateProfessional,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    data: ExampleCvContent,
    language: "en",
  },
} satisfies Meta<typeof CVTemplateProfessional>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
