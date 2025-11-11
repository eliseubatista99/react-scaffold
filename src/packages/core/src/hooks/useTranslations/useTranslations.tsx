export type Language = string;

export type Translation = Record<Language, string>;

export type TranslationValues = Record<string, unknown>;

export declare type TranslationList = {
  [key: string]: Translation;
};

export interface UseTranslationsOutput {
  t: (key: string, values?: TranslationValues) => string;
  getTranslation: (
    translation?: Translation,
    values?: TranslationValues
  ) => string | undefined;
}

export interface UseTranslationsInput {
  language: Language;
  translations: TranslationList;
}

export const useTranslations = (
  input: UseTranslationsInput
): UseTranslationsOutput => {
  const translations = input.translations;
  const language = input.language;

  const getTranslation = (
    translation: Translation | undefined,
    values?: TranslationValues
  ) => {
    if (!translation) {
      return undefined;
    }

    let res = translation[language];

    if (!res) {
      return undefined;
    }

    if (values) {
      Object.keys(values).forEach((key) => {
        const value = values[key];

        res = res.replaceAll(`{{${key}}}`, `${value}`);
      });
    }

    return res;
  };

  const t = (key: string, values?: TranslationValues) => {
    if (translations[key]) {
      const result = getTranslation(translations[key], values);

      if (result == undefined) {
        return key;
      }

      return result;
    }

    return key;
  };

  return {
    t,
    getTranslation,
  };
};
