import { Document } from "@react-pdf/renderer";
import React from "react";
import { PdfPreview } from "../components";

type BaseCVTemplateProps = {
  children?: React.ReactNode;
};

export const BaseCVTemplate = ({ children }: BaseCVTemplateProps) => {
  return (
    <PdfPreview
      content={<Document>{children}</Document>}
      mobileDownloadDisplay={(pdfUrl) => (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Abrir PDF numa nova aba
        </a>
      )}
      tryAgainDisplay={<div>Tentar novamente</div>}
      errorDisplay={(message: string) => <div>{message}</div>}
      loadingDisplay={<div>Carregando PDF...</div>}
    />
  );
};
