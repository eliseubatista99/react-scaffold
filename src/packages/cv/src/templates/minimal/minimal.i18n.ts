import { TranslationList } from "@eliseubatista99/react-scaffold-core";
import { CVTemplateBaseI18n } from "../../resources";

const CVTemplateMinimalI18nSections: TranslationList = {
  "section.skills.title": {
    pt: "Competências",
    en: "Skills",
  },
  "section.professionalSummary.title": {
    pt: "Resumo",
    en: "Summary",
  },
  "section.experience.title": {
    pt: "Experiência",
    en: "Experience",
  },
  "section.education.title": {
    pt: "Educação",
    en: "Education",
  },
};
export const templateI18n: TranslationList = {
  ...CVTemplateBaseI18n,
  ...CVTemplateMinimalI18nSections,
};
