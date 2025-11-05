export type Language = string;

export type Translation = Record<Language, string>;

export declare type TranslationList = {
  [key: string]: Translation;
};

export interface UseTranslationsOutput {
  t: (key: string) => string;
  getTranslation: (translation?: Translation) => string | undefined;
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

  const getTranslation = (translation?: Translation) => {
    if (!translation) {
      return undefined;
    }

    return translation[language];
  };

  const t = (key: string) => {
    if (translations[key]) {
      const result = getTranslation(translations[key]);

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
