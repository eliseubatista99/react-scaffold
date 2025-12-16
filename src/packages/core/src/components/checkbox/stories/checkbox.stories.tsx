import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../checkbox";
import { CheckboxStoriesSetup } from "./setup";

const meta = {
  title: "Core/Components/Checkbox",
  component: CheckboxStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    label: <p>This is a checkbox</p>,
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
    checkboxStyles: { width: "50px", height: "50px" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
