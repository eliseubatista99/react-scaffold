import { TranslationList } from "@eliseubatista99/react-scaffold-core";

const CVTemplateBaseI18nLinks: TranslationList = {
  "link.linkedin": {
    pt: "LinkedIn",
    en: "LinkedIn",
  },
  "link.github": {
    pt: "GitHub",
    en: "GitHub",
  },
  "link.portfolio": {
    pt: "Portfolio",
    en: "Portfolio",
  },
  "link.email": {
    pt: "Email",
    en: "Email",
  },
  "link.phone": {
    pt: "Telemóvel",
    en: "Phone",
  },
  "link.other": {
    pt: "Outro",
    en: "Other",
  },
};

const CVTemplateBaseI18nTime: TranslationList = {
  "time.current": {
    pt: "Atual",
    en: "Current",
  },
  "time.months.Jan": {
    pt: "Jan",
    en: "Jan",
  },
  "time.months.Feb": {
    pt: "Fev",
    en: "Feb",
  },
  "time.months.Mar": {
    pt: "Mar",
    en: "Mar",
  },
  "time.months.Apr": {
    pt: "Abr",
    en: "Apr",
  },
  "time.months.May": {
    pt: "Mai",
    en: "May",
  },
  "time.months.Jun": {
    pt: "Jun",
    en: "Jun",
  },
  "time.months.Jul": {
    pt: "Jul",
    en: "Jul",
  },
  "time.months.Aug": {
    pt: "Ago",
    en: "Aug",
  },
  "time.months.Sep": {
    pt: "Set",
    en: "Sep",
  },
  "time.months.Oct": {
    pt: "Out",
    en: "Oct",
  },
  "time.months.Nov": {
    pt: "Nov",
    en: "Nov",
  },
  "time.months.Dec": {
    pt: "Dez",
    en: "Dec",
  },
};

const CVTemplateBaseI18nEducation: TranslationList = {
  "education.type.secondary": {
    pt: "Ensino Secundário",
    en: "Secondary Education",
  },
  "education.type.technical": {
    pt: "Curso Técnico",
    en: "Technical Course",
  },
  "education.type.bachelor": {
    pt: "Licenciatura",
    en: "Bachelor's Degree",
  },
  "education.type.postgraduate": {
    pt: "Pós-Graduação",
    en: "Postgraduate",
  },
  "education.type.master": {
    pt: "Mestrado",
    en: "Master's Degree",
  },
  "education.type.phd": { pt: "Doutoramento", en: "PhD" },
  "education.status.completed": {
    pt: "Completo",
    en: "Completed",
  },
  "education.status.in.progress": {
    pt: "Em andamento",
    en: "In Progress",
  },
  "education.status.interrupted": {
    pt: "Interrompido",
    en: "Interrupted",
  },
};

const CVTemplateBaseI18nLanguage: TranslationList = {
  "language.level.a1": { pt: "A1", en: "A1" },
  "language.level.a2": { pt: "A2", en: "A2" },
  "language.level.b1": { pt: "B1", en: "B1" },
  "language.level.b2": { pt: "B2", en: "B2" },
  "language.level.c1": { pt: "C1", en: "C1" },
  "language.level.c2": { pt: "C2", en: "C2" },
  "language.level.native": { pt: "Nativo", en: "Native" },
};

const CVTemplateBaseI18nSections: TranslationList = {
  "section.professionalSummary.title": {
    pt: "Resumo Profissional",
    en: "Professional Summary",
  },
  "section.contacts.title": {
    pt: "Contactos",
    en: "Contacts",
  },
  "section.links.title": {
    pt: "Links",
    en: "Links",
  },
  "section.experience.title": {
    pt: "Experiência Profissional",
    en: "Professional Experience",
  },
  "section.education.title": {
    pt: "Formação Académica",
    en: "Education",
  },
  "section.skills.title": {
    pt: "Competências Técnicas",
    en: "Technical Skills",
  },
  "section.languages.title": {
    pt: "Idiomas",
    en: "Languages",
  },
  "section.certification.title": {
    pt: "Certificações",
    en: "Certifications",
  },
  "section.certification.action": {
    pt: "Ver Certificado",
    en: "View Certificate",
  },
  "section.volunteer.title": {
    pt: "Voluntariado",
    en: "Volunteer Work",
  },
  "section.projects.title": {
    pt: "Projetos",
    en: "Projects",
  },
  "section.projects.action": {
    pt: "Ver Projeto",
    en: "View Project",
  },
  "section.projects.source": {
    pt: "Código Fonte",
    en: "Source Code",
  },
};

export const CVTemplateBaseI18n: TranslationList = {
  ...CVTemplateBaseI18nLinks,
  ...CVTemplateBaseI18nTime,
  ...CVTemplateBaseI18nEducation,
  ...CVTemplateBaseI18nLanguage,
  ...CVTemplateBaseI18nSections,
};
