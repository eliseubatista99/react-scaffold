import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "../form";

const meta = {
  title: "Core/Components/Form",
  component: Form,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    fields: [
      {
        name: "username",
        content: <input id="username" />,
      },
      {
        name: "password",
        content: <input id="password" />,
      },
    ],
    submitButton: {
      content: <button>Submit</button>,
    },
    onSubmit: (data) =>
      alert(Object.keys(data).map((item) => `${item}: ${data[item]}`)),
    styles: { width: "50%" },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
