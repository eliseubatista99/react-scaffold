"use client";

import { useEffect, useState } from "react";
import { usePdfGenerator } from "../../hooks";
import { PdfPreviewProps } from "./pdfPreview";

export const usePdfPreviewHelper = (props: PdfPreviewProps) => {
  const { content } = props;

  const { generatePdf } = usePdfGenerator();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let isCurrent = true;
    let generatedUrl: string | null = null;

    setLoading(true);
    setError(null);

    const createPdf = async () => {
      try {
        const result = await generatePdf(content);

        if (!isCurrent) {
          if (result.url) URL.revokeObjectURL(result.url);
          return;
        }

        if (result.error || !result.url) {
          if (result.url) URL.revokeObjectURL(result.url);
          setError(`Error generating PDF: ${result.error ?? "Unknown"}`);
          return;
        }

        generatedUrl = result.url;
        setPdfUrl(result.url);
        setPdfSize(result.size ?? 0);
      } catch (caught) {
        if (isCurrent) {
          setError(
            `Error generating PDF: ${
              caught instanceof Error ? caught.message : String(caught)
            }`
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    setPdfUrl(null);
    setPdfSize(0);
    void createPdf();

    return () => {
      isCurrent = false;
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [content, generatePdf]);

  return {
    pdfUrl,
    loading,
    error,
    setError,
    isMobile,
    pdfSize,
  };
};
