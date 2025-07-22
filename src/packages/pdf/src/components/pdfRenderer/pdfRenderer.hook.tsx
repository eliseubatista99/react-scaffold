import React from "react";
import { PdfRendererProps } from "./pdfRenderer";

export type PdfPageConfig = {
  pageNum: number;
  width?: number;
  heigth?: number;
};

export const usePdfRendererHelper = ({
  currentPage,
  onDocumentLoaded,
}: PdfRendererProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const numPagesRef = React.useRef<number>(0);
  const [pages, setPages] = React.useState<PdfPageConfig[]>([]);

  const createPageConfigs = () => {
    var pagesArray = Array.from(
      { length: numPagesRef.current },
      (_, i) => i + 1
    );

    // If it is paginated, only show the currentPage
    if (currentPage !== undefined) {
      pagesArray = [pagesArray.find((p) => p === currentPage) || 1];
    }

    setPages(
      pagesArray.map((p): PdfPageConfig => {
        return {
          pageNum: p,
          width: containerRef.current?.clientWidth,
          heigth: containerRef.current?.clientHeight,
        };
      })
    );
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    numPagesRef.current = numPages;

    onDocumentLoaded?.(numPages);
    createPageConfigs();
  };

  React.useEffect(() => {
    if (containerRef.current) {
      createPageConfigs();
    }
  }, [containerRef]);

  React.useEffect(() => {
    createPageConfigs();
  }, [currentPage]);

  return {
    containerRef,
    pages,
    onDocumentLoadSuccess,
  };
};
