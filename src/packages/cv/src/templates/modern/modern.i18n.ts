import { TranslationList } from "@eliseubatista99/react-scaffold-core";
import { CVTemplateBaseI18n } from "../../resources";

const CVTemplateModernI18nSections: TranslationList = {
  "section.skillsAndLanguages.title": {
    pt: "Competências e Idiomas",
    en: "Skills and Languages",
  },
};

export const templateI18n: TranslationList = {
  ...CVTemplateBaseI18n,
  ...CVTemplateModernI18nSections,
};
