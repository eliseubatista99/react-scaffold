import { PdfPreview } from "@eliseubatista99/react-scaffold-pdf";
import { useMemo } from "react";
import { useGetCVDocument } from "../../hooks";
import { CvTemplateProps, CVTemplateType } from "../../types";

export interface CurriculumVitaeProps extends CvTemplateProps {
  template: CVTemplateType;
}

export const CurriculumVitae = (props: CurriculumVitaeProps) => {
  const { getDocument } = useGetCVDocument();
  const {
    data,
    documentConfigs,
    language,
    pageConfigs,
    template,
    theme,
    title,
  } = props;
  const content = useMemo(
    () =>
      getDocument({
        data,
        documentConfigs,
        language,
        pageConfigs,
        template,
        theme,
        title,
      }),
    [
      getDocument,
      data,
      documentConfigs,
      language,
      pageConfigs,
      template,
      theme,
      title,
    ]
  );
  const isPortuguese = language === "pt";

  return (
    <PdfPreview
      content={content}
      mobileDownloadDisplay={(pdfUrl) => (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          {isPortuguese ? "Abrir PDF numa nova aba" : "Open PDF in a new tab"}
        </a>
      )}
      tryAgainDisplay={
        <div>{isPortuguese ? "Tentar novamente" : "Try again"}</div>
      }
      errorDisplay={(message: string) => <div>{message}</div>}
      loadingDisplay={
        <div>{isPortuguese ? "Carregando PDF..." : "Loading PDF..."}</div>
      }
    />
  );
};
