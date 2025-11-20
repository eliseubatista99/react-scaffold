import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextAreaField } from "../textAreaField";

const meta = {
  title: "Core/Components/Text Area",
  component: TextAreaField,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    name: "example-text-area-field",
    placeHolder: "This is an example text area field",
    onFocus: () => {
      console.debug("TextArea > OnFocus");
    },
  },
} satisfies Meta<typeof TextAreaField>;

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
    leftIcon: (
      <p
        style={{ fontSize: "30px", margin: 0, marginBlock: 0, marginInline: 0 }}
      >
        {"🏁"}
      </p>
    ),
  },
};

export const SearchInput: Story = {
  args: {
    rightIcon: (
      <p
        style={{ fontSize: "30px", margin: 0, marginBlock: 0, marginInline: 0 }}
      >
        {"⌕"}
      </p>
    ),
  },
};
