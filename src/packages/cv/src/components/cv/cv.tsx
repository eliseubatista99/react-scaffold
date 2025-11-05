import { PdfPreview } from "@eliseubatista99/react-scaffold-pdf";
import { useGetCVDocument } from "../../hooks";
import { CvTemplateProps, CVTemplateType } from "../../types";

export interface CurriculumVitaeProps extends CvTemplateProps {
  template: CVTemplateType;
}

export const CurriculumVitae = (props: CurriculumVitaeProps) => {
  const { getDocument } = useGetCVDocument();

  return (
    <PdfPreview
      content={getDocument(props)}
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
