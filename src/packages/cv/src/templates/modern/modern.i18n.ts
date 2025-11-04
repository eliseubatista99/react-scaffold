import { TranslationList } from "@eliseubatista99/react-scaffold-core";
import { CVTemplateBaseI18n } from "../../resources";

const CVTemplateModernI18nTime: TranslationList = {
  "time.current": {
    pt: "Atual",
    en: "Present",
  },
};

export const templateI18n: TranslationList = {
  ...CVTemplateBaseI18n,
  ...CVTemplateModernI18nTime,
};
