import type { Meta, StoryObj } from "@storybook/react-vite";

import { NavigationProvider } from "../navigationProvider";
import {
  NavigationExampleScreen0,
  NavigationExampleScreen1,
  NavigationExampleScreen2,
  NavigationStoriesSetup,
} from "./setup";

const meta = {
  title: "Providers/Navigation Provider",
  component: NavigationStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    routes: [
      {
        path: "/",
        render: <NavigationExampleScreen0 />,
      },
      {
        path: "/screen1",
        render: <NavigationExampleScreen1 />,
      },
      {
        path: "/screen2",
        render: <NavigationExampleScreen2 />,
      },
    ],
  },
} satisfies Meta<typeof NavigationProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};
