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
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
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
