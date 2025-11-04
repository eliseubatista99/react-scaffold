import type { Meta, StoryObj } from "@storybook/react-vite";
import { PdfPreview } from "../pdfPreview";
import { PdfPreviewExampleContent } from "./exampleContent";
const meta = {
  title: "Pdf/Components/PdfPreview",
  component: PdfPreview,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    content: <PdfPreviewExampleContent />,
    mobileDownloadDisplay: (pdfUrl: string) => (
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors duration-300"
      >
        Abrir PDF numa nova aba
      </a>
    ),
    tryAgainDisplay: <div>Tentar novamente</div>,
    errorDisplay: (message: string) => <div>{message}</div>,
    loadingDisplay: <div>Carregando PDF...</div>,
  },
} satisfies Meta<typeof PdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
