import { Language } from "@eliseubatista99/react-scaffold-core";
import { CvData } from "./cv";

export interface CvTemplateProps {
  title?: string;
  language?: Language;
  theme?: CvTheme;
  data: CvData;
}

export interface CvTheme {
  color: string;
}
