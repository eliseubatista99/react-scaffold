import React from "react";
import { PdfHelper } from "../pdfHelper";

export const PdfHelperStoriesSetup = () => {
  const targetRef = React.useRef<HTMLDivElement>(null);

  const htmlElement = (
    <div ref={targetRef} style={{ width: "300px", height: "300px" }}>
      hello
    </div>
  );

  return (
    <div style={{ padding: "20px", gap: "8px" }}>
      {htmlElement}

      <button
        onClick={() => PdfHelper.generatePdfFromRef(targetRef, "testHtml.pdf")}
      >
        Generate pdf from ref
      </button>
    </div>
  );
};
