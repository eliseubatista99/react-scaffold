export type Language = string;

export type Translation = Record<Language, string>;

export declare type TranslationList = {
  [key: string]: Translation;
};

export interface UseTranslationsOutput {
  t: (key: string) => string;
  getTranslation: (translation: Translation) => string;
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

  const getTranslation = (translation: Translation) => {
    return translation[language];
  };

  const t = (key: string) => {
    if (translations[key]) {
      return getTranslation(translations[key]);
    }

    return key;
  };

  return {
    t,
    getTranslation,
  };
};
