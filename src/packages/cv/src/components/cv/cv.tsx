import React from "react";
import { CVTemplateClassic } from "../../templates/classic";
import { CVTemplateModern } from "../../templates/modern";
import { CVTemplateTimeline } from "../../templates/timeline";
import { CvTemplateProps, CVTemplateType } from "../../types";
import { PdfPreview } from "../pdfPreview";

export interface CurriculumVitaeProps extends CvTemplateProps {
  template: CVTemplateType;
}

export const CurriculumVitae = (props: CurriculumVitaeProps) => {
  const getTemplate = React.useCallback(() => {
    switch (props.template) {
      case "classic":
        return <CVTemplateClassic {...props} />;
      case "timeline":
        return <CVTemplateTimeline {...props} />;
      default:
        return <CVTemplateModern {...props} />;
    }
  }, [props]);

  return (
    <PdfPreview
      content={getTemplate()}
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
