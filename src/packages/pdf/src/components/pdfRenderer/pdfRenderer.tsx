import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { usePdfRendererHelper } from "./pdfRenderer.hook";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

export interface PdfRendererProps {
  file: string;
  currentPage?: number;
  onDocumentLoaded?: (numberOfPages: number) => void;
  styles?: React.CSSProperties;
}

export const PdfRenderer = (props: PdfRendererProps) => {
  const { file, styles } = props;

  const { pages, onDocumentLoadSuccess, containerRef } =
    usePdfRendererHelper(props);

  const pagesJSX = pages.map((p) => (
    <Page
      key={p.pageNum}
      pageNumber={p.pageNum}
      width={p.width}
      height={p.heigth}
    />
  ));

  const document = (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      options={options}
    >
      {pagesJSX}
    </Document>
  );

  return (
    <div
      ref={containerRef}
      data-testid="pdf-renderer-file"
      style={{ width: "100%", height: "100%", ...styles }}
    >
      {document}
    </div>
  );
};
