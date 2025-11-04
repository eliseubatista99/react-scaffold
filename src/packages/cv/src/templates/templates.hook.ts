import {
  TranslationList,
  useTranslations,
} from "@eliseubatista99/react-scaffold-core";
import React from "react";
import {
  CvTemplateProps,
  EducationStatus,
  EducationType,
  LanguageLevel,
  Link,
  LinkType,
  Month,
} from "../types";

interface TemplateHelperProps extends CvTemplateProps {
  translations: TranslationList;
}

export const useTemplateHelper = ({
  data,
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

  const getSocialUrl = (link: Link) => {
    if (!link.value) return "";
    const val = link.value.trim();
    const hasProtocol = /^https?:\/\//i.test(val);

    if (link.type === "email") return `mailto:${val}`;
    if (link.type === "phone") return `tel:${val}`;

    // If the value already includes a known domain but lacks protocol, prefix https
    if (!hasProtocol) {
      if (/linkedin\.com/i.test(val)) return `https://${val}`;
      if (/github\.com/i.test(val)) return `https://${val}`;
      if (/gitlab\.com/i.test(val)) return `https://${val}`;
    }

    if (!hasProtocol) {
      if (link.type === "linkedin") return `https://www.linkedin.com/in/${val}`;
      if (link.type === "github") return `https://github.com/${val}`;
      return `https://${val}`; // portfolio/other
    }
    return val;
  };

  const formatPhone = (countryCode: string, phone: string) => {
    return data.personalInfo?.countryCode && data.personalInfo?.phone
      ? `${countryCode.match(/\(([^)]+)\)/)?.[1] || countryCode} ${phone}`
      : phone;
  };

  const getData = React.useCallback(() => {
    return {
      personalInfo: {
        ...data.personalInfo,
        desiredRole: getTranslation(data.personalInfo?.desiredRole),
      },
      links: data.links,
      resume: getTranslation(data.resume),
      experiences: data.experiences?.map((item) => {
        return {
          ...item,
          role: getTranslation(item.role),
          tech: getTranslation(item.tech),
          activities: getTranslation(item.activities),
          results: getTranslation(item.results),
        };
      }),
      education: data.education?.map((item) => {
        return {
          ...item,
          course: getTranslation(item.course),
          description: getTranslation(item.description),
        };
      }),
      skills: getTranslation(data.skills),
      languages: data.languages?.map((item) => {
        return {
          ...item,
          name: getTranslation(item.name),
        };
      }),
      certifications: data.certifications?.map((item) => {
        return {
          ...item,
          name: getTranslation(item.name),
          description: getTranslation(item.description),
        };
      }),
      volunteers: data.volunteers?.map((item) => {
        return {
          ...item,
          role: getTranslation(item.role),
          description: getTranslation(item.description),
          impact: getTranslation(item.impact),
        };
      }),
      projects: data.projects?.map((item) => {
        return {
          ...item,
          description: getTranslation(item.description),
          tech: getTranslation(item.tech),
        };
      }),
    };
  }, [data]);

  return {
    getTranslation,
    i18n: getI18n(),
    languageLevelToPercent,
    getSocialUrl,
    formatPhone,
    data: getData(),
  };
};
