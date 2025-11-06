import { Language } from "@eliseubatista99/react-scaffold-core";
import { DocumentProps, PageProps } from "@react-pdf/renderer/lib/react-pdf";
import { CvData } from "./cv";

export type BaseCVTemplateProps = {
  documentConfigs?: DocumentProps;
  pageConfigs?: PageProps;
  title?: string;
  language?: Language;
  children?: React.ReactNode;
};

export type CvTemplateProps = Omit<BaseCVTemplateProps, "children"> & {
  theme?: CvTheme;
  data: CvData;
};

export interface CvTheme {
  color: string;
}
