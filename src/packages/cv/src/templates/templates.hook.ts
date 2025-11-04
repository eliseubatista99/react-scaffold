import {
  Language,
  TranslationList,
  useTranslations,
} from "@eliseubatista99/react-scaffold-core";
import {
  EducationStatus,
  EducationType,
  LanguageLevel,
  LinkType,
  Month,
} from "../types";

interface TemplateHelperProps {
  language?: Language;
  translations: TranslationList;
}

export const useTemplateHelper = ({
  language,
  translations,
}: TemplateHelperProps) => {
  const { t, getTranslation } = useTranslations({
    language: language || "en",
    translations,
  });

  const getI18n = () => {
    return {
      global: {
        link: (type: LinkType) => t(`link.${type}`),
        time: {
          current: t("time.current"),
          month: (index: Month) => t(`time.months.${index}`),
        },
        education: {
          type: (type: EducationType) => t(`education.type.${type}`),
          status: (status: EducationStatus) => t(`education.status.${status}`),
        },
        language: {
          level: (value: LanguageLevel) => t(`language.level.${value}`),
        },
      },
      sections: {
        summary: {
          title: t("section.professionalSummary.title"),
        },
        links: {
          title: t("section.links.title"),
        },
        contacts: {
          title: t("section.contacts.title"),
        },
        experience: {
          title: t("section.experience.title"),
        },
        education: {
          title: t("section.education.title"),
        },
        skills: {
          title: t("section.skills.title"),
        },
        languages: {
          title: t("section.languages.title"),
        },
        certification: {
          title: t("section.certification.title"),
          action: t("section.certification.action"),
        },
        volunteer: {
          title: t("section.volunteer.title"),
        },
        projects: {
          title: t("section.projects.title"),
          action: t("section.projects.action"),
          source: t("section.projects.source"),
        },
        skillsAndLanguages: {
          title: t("section.skillsAndLanguages.title"),
        },
      },
    };
  };

  const languageLevelToPercent = (level: LanguageLevel) => {
    switch (level) {
      case "a1":
        return 20;
      case "a2":
        return 35;
      case "b1":
        return 55;
      case "b2":
        return 70;
      case "c1":
        return 85;
      case "c2":
        return 100;
      case "native":
        return 100;
      default:
        return 50;
    }
  };

  return {
    i18n: getI18n(),
    languageLevelToPercent,
  };
};
