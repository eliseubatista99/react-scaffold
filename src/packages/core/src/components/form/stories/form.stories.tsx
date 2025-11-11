import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputField } from "../../inputField";
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
        content: <InputField name={"username"} />,
      },
      {
        name: "password",
        content: <InputField name={"password"} type="password" />,
      },
    ],
    submitButton: {
      content: <button>Submit</button>,
    },
    onSubmit: (data) =>
      alert(data.map((item) => `${item.name}: ${item.value}`)),
    styles: { width: "50%" },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
