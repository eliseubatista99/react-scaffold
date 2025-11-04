import { TranslationList } from "@eliseubatista99/react-scaffold-core";
import { CVTemplateBaseI18n } from "../../resources";

const CVTemplateTimelineI18nSections: TranslationList = {
  "section.professionalSummary.title": {
    pt: "Resumo",
    en: "Summary",
  },
  "section.education.title": {
    pt: "Educação",
    en: "Education",
  },
  "section.experience.title": {
    pt: "Experiência",
    en: "Experience",
  },
};

export const templateI18n: TranslationList = {
  ...CVTemplateBaseI18n,
  ...CVTemplateTimelineI18nSections,
};
