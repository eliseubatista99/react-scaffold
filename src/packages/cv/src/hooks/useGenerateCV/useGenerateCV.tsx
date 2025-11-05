import { usePdfGenerator } from "@eliseubatista99/react-scaffold-pdf";
import { CurriculumVitaeProps } from "../../components";
import { useGetCVDocument } from "../useGetCVDocument";

interface GenerateCVOutput {
  error?: string;
  url?: string;
  size?: number;
}

export const useCVGenerator = () => {
  const { generatePdf, downloadPdf } = usePdfGenerator();
  const { getDocument } = useGetCVDocument();

  const generateCV = async (
    data: CurriculumVitaeProps
  ): Promise<GenerateCVOutput> => {
    const doc = getDocument(data);
    const result = await generatePdf(doc);

    return {
      error: result.error,
      size: result.size,
      url: result.url,
    };
  };

  const downloadCV = async (data: CurriculumVitaeProps) => {
    const result = await generateCV(data);

    if (result.url) {
      downloadPdf(result.url);
    }
  };

  return {
    generateCV,
    downloadCV,
  };
};
