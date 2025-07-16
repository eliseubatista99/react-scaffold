import { renderToStaticMarkup } from "react-dom/server";
import { PdfHelper } from "../../helpers";

export const usePdfGenerator = () => {
  const generate = async (content: React.ReactNode, fileName: string) => {
    const output = document.createElement("p");
    const staticElement = renderToStaticMarkup(content);
    output.innerHTML = staticElement;
    document.body.appendChild(output);

    const res = await PdfHelper.generatePdfFromHTMLElement(output, fileName);

    document.body.removeChild(output);

    return res;
  };

  return generate;
};
