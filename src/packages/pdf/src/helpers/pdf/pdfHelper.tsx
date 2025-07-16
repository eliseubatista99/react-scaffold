import generatePDF from "react-to-pdf";

export class PdfHelper {
  static generatePdfFromRef = async (
    content: React.RefObject<any>,
    filename: string
  ) => {
    return await generatePDF(content, { filename });
  };
}
