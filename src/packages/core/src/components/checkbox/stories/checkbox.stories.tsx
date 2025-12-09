import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../checkbox";

const meta = {
  title: "Core/Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    name: "check",
    checked: false,
    customCheckedRender: (
      <p
        style={{
          fontSize: "45px",
          fontWeight: 600,
          color: "#ffffff",
          paddingBottom: "5px",
        }}
      >
        {"✔"}
      </p>
    ),
    customUncheckedRender: (
      <p
        style={{
          fontSize: "45px",
          fontWeight: 500,
          color: "#000000",
          paddingBottom: "5px",
        }}
      >
        {"."}
      </p>
    ),
    styles: { width: "50px", height: "50px" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};
