import { pdf } from "@react-pdf/renderer";

interface GeneratePdfOutput {
  error?: string;
  url?: string;
  size?: number;
}

export const usePdfGenerator = () => {
  const generatePdf = async (
    content: JSX.Element
  ): Promise<GeneratePdfOutput> => {
    try {
      // Generate a PDF blob from the document
      const blob = await pdf(content).toBlob();

      // Create a URL from the PDF blob for preview
      const url = URL.createObjectURL(blob);

      return {
        error: undefined,
        url,
        size: blob.size,
      };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Unknown",
        url: undefined,
        size: undefined,
      };
    }
  };

  const downloadPdf = async (url: string) => {
    const output = document.createElement("a");
    output.href = url;
    output.target = "_blank";
    output.rel = "noopener noreferrer";

    output.click();
  };

  return {
    generatePdf,
    downloadPdf,
  };
};
