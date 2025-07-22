import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoreHelper } from "../storeHelper";
import { CreateStoreHelperStoriesSetup } from "./setup";

const meta = {
  title: "Store/Helpers/Create Store",
  component: CreateStoreHelperStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof StoreHelper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
