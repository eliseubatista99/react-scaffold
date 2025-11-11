import { useTranslations, UseTranslationsInput } from "../useTranslations";

export const UseTranslationsStoriesSetup = (input: UseTranslationsInput) => {
  const { t } = useTranslations(input);

  return (
    <div style={{ padding: "20px" }}>
      <p>Example1: {t("translation.example.1")}</p>
      <p>Example2: {t("translation.example.2")}</p>
      <p>Example2: {t("translation.example.3", { value: "Zau" })}</p>
    </div>
  );
};
