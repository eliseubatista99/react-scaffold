import { renderToStaticMarkup } from "react-dom/server";
import { PdfHelper } from "../../helpers";

export const usePdfGenerator = () => {
  const generateFromContent = async (
    content: React.ReactNode,
    fileName: string
  ) => {
    const output = document.createElement("p");
    const staticElement = renderToStaticMarkup(content);
    output.innerHTML = staticElement;
    document.body.appendChild(output);

    const res = await PdfHelper.generatePdfFromHTMLElement(output, fileName);

    document.body.removeChild(output);

    return res;
  };

  const generateFromRef = async (
    ref: React.RefObject<any>,
    fileName: string
  ) => {
    const res = await PdfHelper.generatePdfFromRef(ref, fileName);
    return res;
  };

  return {
    generateFromContent,
    generateFromRef,
  };
};
