import { CurriculumVitaeProps } from "../../components";
import { CVTemplateClassic } from "../../templates/classic";
import { CVTemplateModern } from "../../templates/modern";
import { CVTemplateTimeline } from "../../templates/timeline";

export const useGetCVDocument = () => {
  const getDocument = (data: CurriculumVitaeProps) => {
    switch (data.template) {
      case "classic":
        return <CVTemplateClassic {...data} />;
      case "timeline":
        return <CVTemplateTimeline {...data} />;
      default:
        return <CVTemplateModern {...data} />;
    }
  };

  return {
    getDocument,
  };
};
