import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputField } from "../inputField";

const meta = {
  title: "Core/Components/Input Field",
  component: InputField,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    name: "example-input-field",
    placeHolder: "This is an example input field",
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: <p style={{ margin: 0, padding: 0 }}>This is a label</p>,
  },
};

export const WithErrorMessage: Story = {
  args: {
    bottomMessage: (
      <p style={{ margin: 0, padding: 0, color: "red", fontWeight: 800 }}>
        This is a bottom message
      </p>
    ),
  },
};

export const CountrySearch: Story = {
  args: {
    leftIcon: <p style={{ fontSize: "25px" }}>{"🏁"}</p>,
  },
};

export const SearchInput: Story = {
  args: {
    rightIcon: <p style={{ fontSize: "30px" }}>{"⌕"}</p>,
  },
};
