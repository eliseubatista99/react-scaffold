import React from "react";
import { PdfRendererProps } from "./pdfRenderer";

export type PdfPageConfig = {
  pageNum: number;
  width?: number;
  height?: number;
};

export const usePdfRendererHelper = ({
  currentPage,
  onDocumentLoaded,
}: PdfRendererProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const numPagesRef = React.useRef<number>(0);
  const [pages, setPages] = React.useState<PdfPageConfig[]>([]);

  const createPageConfigs = React.useCallback(() => {
    let pagesArray = Array.from(
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
          height: containerRef.current?.clientHeight,
        };
      })
    );
  }, [currentPage]);

  const onDocumentLoadSuccess = React.useCallback(
    ({ numPages }: { numPages: number }) => {
      numPagesRef.current = numPages;

      onDocumentLoaded?.(numPages);
      createPageConfigs();
    },
    [createPageConfigs, onDocumentLoaded]
  );

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(createPageConfigs);
      observer.observe(container);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", createPageConfigs);
    return () => window.removeEventListener("resize", createPageConfigs);
  }, [createPageConfigs]);

  React.useEffect(() => {
    createPageConfigs();
  }, [createPageConfigs]);

  return {
    containerRef,
    pages,
    onDocumentLoadSuccess,
  };
};
