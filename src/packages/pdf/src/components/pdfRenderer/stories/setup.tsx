import React from "react";
import { PdfRenderer, PdfRendererProps } from "../pdfRenderer";

export const PdfRendererStoriesSetup = (props: PdfRendererProps) => {
  const currentPageRef = React.useRef<number | undefined>(props.currentPage);
  const [currentPage, setCurrentPageState] = React.useState<number | undefined>(
    props.currentPage
  );
  const [numberOfPages, setNumberOfPages] = React.useState<number>(1);

  const setCurrentPage = (value: number) => {
    currentPageRef.current = value;
    setCurrentPageState(value);
  };

  const onDocumentLoaded = (value: number) => {
    setNumberOfPages(value);
  };

  const canMoveInDirection = React.useCallback(
    (dir: number) => {
      if (currentPageRef.current === undefined) {
        return false;
      }

      return (
        currentPageRef.current + dir > 0 &&
        currentPageRef.current + dir <= numberOfPages
      );
    },
    [currentPageRef, numberOfPages]
  );

  const onClickMovePage = React.useCallback(
    (value: number) => {
      if (canMoveInDirection(value)) {
        setCurrentPage((currentPageRef.current || 1) + value);
      }
    },
    [currentPageRef, setCurrentPage]
  );

  return (
    <div
      style={{
        width: "600px",
        background: currentPage === undefined ? undefined : "#292929ff",
        padding: "2px",
      }}
    >
      {currentPage === undefined && (
        <PdfRenderer
          {...props}
          currentPage={currentPage}
          onDocumentLoaded={onDocumentLoaded}
        />
      )}
      {currentPage !== undefined && (
        <>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              height: "30px",
              gap: "24px",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
            }}
          >
            {canMoveInDirection(-1) && (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickMovePage(-1)}
              >
                {"<-"}
              </div>
            )}
            <p>
              {currentPage} / {numberOfPages}
            </p>
            {canMoveInDirection(1) && (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onClickMovePage(1);
                }}
              >
                {"->"}
              </div>
            )}
          </div>
          <div style={{ width: "100%" }}>
            <PdfRenderer
              {...props}
              currentPage={currentPage}
              onDocumentLoaded={onDocumentLoaded}
            />
          </div>
        </>
      )}
    </div>
  );
};
