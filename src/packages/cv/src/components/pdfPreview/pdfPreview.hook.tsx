"use client";

import { pdf } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { PdfPreviewProps } from "./pdfPreview";

export const usePdfPreviewHelper = (props: PdfPreviewProps) => {
  const { content, tryAgainDisplay, errorDisplay, loadingDisplay } = props;

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pdfSize, setPdfSize] = useState<number>(0);

  // Detect if the device is mobile to adjust PDF preview behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate PDF whenever the modal is shown or any relevant data changes
  useEffect(() => {
    generatePdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePdf = async () => {
    setLoading(true);
    setError(null);
    try {
      // Generate a PDF blob from the document
      const blob = await pdf(content).toBlob();
      setPdfSize(blob.size);

      // Create a URL from the PDF blob for preview
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      setError(
        `Error generating PDF: ${
          error instanceof Error ? error.message : "Unknown"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Cleanup the PDF URL when the component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return {
    pdfUrl,
    loading,
    error,
    setError,
    isMobile,
    pdfSize,
  };
};
