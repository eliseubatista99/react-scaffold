import { usePdfPreviewHelper } from "./pdfPreview.hook";

export interface PdfPreviewProps {
  content: JSX.Element;
  mobileDownloadDisplay: (pdfUrl: string) => JSX.Element;
  tryAgainDisplay?: JSX.Element;
  errorDisplay?: (message: string) => JSX.Element;
  loadingDisplay?: JSX.Element;
  styles?: React.CSSProperties;
}

export const PdfPreview = (props: PdfPreviewProps) => {
  const {
    tryAgainDisplay,
    errorDisplay,
    loadingDisplay,
    mobileDownloadDisplay,
    styles,
  } = props;

  const { loading, error, setError, isMobile, pdfSize, pdfUrl } =
    usePdfPreviewHelper(props);

  const showLoading = loading;
  const showError = !loading && error;
  const showPdf = !loading && !error && pdfUrl;
  const showTryAgain = !loading && !error && !pdfUrl;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...styles,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {showLoading && (
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
          {loadingDisplay}
        </div>
      )}
      {showError && (
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
          {errorDisplay?.(error)}
        </div>
      )}
      {showTryAgain && (
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
          {tryAgainDisplay}
        </div>
      )}
      {showPdf && (
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
          {isMobile && mobileDownloadDisplay(pdfUrl)}
          {!isMobile && (
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                minHeight: "600px",
              }}
              onLoad={() => console.log("PDF iframe loaded successfully")}
              onError={() => {
                setError("Error loading PDF on iframe");
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
