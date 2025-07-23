import type { Meta, StoryObj } from "@storybook/react-vite";
import { useTranslations, UseTranslationsInput } from "../useTranslations";
import { UseTranslationsStoriesSetup } from "./setup";

const baseArgs: UseTranslationsInput = {
  language: "en",
  translations: {
    "translation.example.1": {
      pt: "Exemplo de tradução 1",
      en: "Translation example 1",
    },
    "translation.example.2": {
      pt: "Exemplo de tradução 2",
      en: "Translation example 2",
    },
  },
};

const meta = {
  title: "Core/Hooks/useTranslations",
  component: UseTranslationsStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    ...baseArgs,
  },
} satisfies Meta<typeof useTranslations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  args: { ...baseArgs },
};

export const Portuguese: Story = {
  args: {
    ...baseArgs,
    language: "pt",
  },
};
