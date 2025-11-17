import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageLayout, PageLayoutProps } from "../pageLayout";
import { PageLayoutStoriesSetup } from "./setup";

const baseArgs: PageLayoutProps = {
  header: {
    visibility: "always",
    content: <></>,
  },
  footer: {
    visibility: "always",
    content: <></>,
  },
  pageStyles: {
    paddingLeft: "24px",
    paddingRight: "24px",
  },
  children: <div>Hello</div>,
};

const meta = {
  title: "Core/Components/PageLayout",
  component: PageLayoutStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: baseArgs,
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithHeaderAlwaysVisible: Story = {
  args: {
    ...baseArgs,

    footer: undefined,
  },
};

export const WithFixedHeader: Story = {
  args: {
    ...baseArgs,
    header: {
      ...baseArgs.header,
      visibility: "fixed",
    } as any,
    footer: undefined,
  },
};

export const WithFooterAlwaysVisible: Story = {
  args: {
    ...baseArgs,

    header: undefined,
  },
};

export const WithFixedFooter: Story = {
  args: {
    ...baseArgs,
    footer: {
      ...baseArgs.footer,
      visibility: "fixed",
    } as any,
    header: undefined,
  },
};

export const NoHeaderAndNoFooter: Story = {
  args: {
    ...baseArgs,
    header: undefined,
    footer: undefined,
  },
};
