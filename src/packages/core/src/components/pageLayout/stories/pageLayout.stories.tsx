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

export const WithSidebar: Story = {
  args: {
    ...baseArgs,
    sidebar: {
      content: (
        <div
          style={{
            width: "100%",
            flex: 1,
            background: "#ffffff",
            padding: "30px 15px",
            borderRight: "1px solid #E2E8F0",
            gap: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map((i) => (
            <div
              style={{
                background: `rgba(120, 2000, 60, ${100 / i})`,
                width: "300px",
                height: "100px",
                maxWidth: "100%",
              }}
            />
          ))}
        </div>
      ),
    },
    pageStyles: {
      padding: "24px",
    },
    header: undefined,
    footer: undefined,
  },
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
