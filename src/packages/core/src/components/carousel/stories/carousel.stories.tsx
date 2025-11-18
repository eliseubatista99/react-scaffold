import type { Meta, StoryObj } from "@storybook/react-vite";
import { Carousel } from "../carousel";

const slide = () => ({
  content: (
    <div
      style={{
        width: "200px",
        height: "250px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "rgb(" +
            Math.floor(Math.random() * 255) +
            "," +
            Math.floor(Math.random() * 255) +
            "," +
            Math.floor(Math.random() * 255) +
            ")",
        }}
      ></div>
    </div>
  ),
});

const meta = {
  title: "Core/Components/Carousel",
  component: Carousel,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    content: [slide(), slide(), slide(), slide(), slide()],
    settings: {},
    styles: { padding: "10px 24px" },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const NoGap: Story = {
  args: {
    gap: 0,
  },
};

export const WithDots: Story = {
  args: {
    settings: {
      dots: true,
    },
  },
};
