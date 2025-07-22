import type { Meta, StoryObj } from "@storybook/react-vite";

import { UseFetchStoriesSetup } from "./setup";

const meta = {
  title: "Core/Hooks/useFetch",
  component: UseFetchStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    url: "",
  },
} satisfies Meta<typeof UseFetchStoriesSetup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JsonPlaceholder: Story = {
  args: {
    url: "https://jsonplaceholder.typicode.com/posts/1",
    type: {
      userId: 1,
      id: 1,
      title: "",
      body: "",
    },
  },
};

export const Pikachu: Story = {
  args: {
    url: "https://pokeapi.co/api/v2/pokemon/pikachu",
    type: {
      abilities: [
        {
          ability: {
            name: "",
            url: "",
          },
          is_hidden: false,
          slot: 1,
        },
      ],
      base_experience: 1,
      forms: [{ name: "", url: "" }],
      height: 1,
      id: 1,
      name: "",
      order: 1,
      species: {
        name: "",
        url: "",
      },
      sprites: {
        back_default: "",
        back_female: null,
        back_shiny: "",
        back_shiny_female: null,
        front_default: "",
        front_female: null,
        front_shiny: "",
        front_shiny_female: null,
      },
      stats: [
        {
          base_stat: 1,
          effort: 1,
          stat: { name: "", url: "" },
        },
      ],
      types: [
        {
          slot: 1,
          type: { name: "", url: "" },
        },
      ],
      weight: 1,
    },
  },
};
