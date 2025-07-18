import React from "react";
import { PdfHelper } from "../pdfHelper";

export const PdfHelperStoriesSetup = () => {
  const targetRef = React.useRef<HTMLDivElement>(null);

  const exampleContent = (
    <div style={{ width: "300px", height: "300px", color: "#d10050" }}>
      hello
    </div>
  );

  const htmlElement = (
    <div ref={targetRef} style={{ width: "300px", height: "fit-content" }}>
      {exampleContent}
    </div>
  );

  return (
    <div style={{ padding: "20px", gap: "8px" }}>
      <button
        onClick={() => PdfHelper.generatePdfFromRef(targetRef, "testHtml.pdf")}
      >
        Generate pdf from ref
      </button>
      {htmlElement}
    </div>
  );
};
