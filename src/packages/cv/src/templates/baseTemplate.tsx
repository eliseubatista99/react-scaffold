import { Document } from "@react-pdf/renderer";
import { BaseCVTemplateProps } from "../types";

export const BaseCVTemplate = ({
  children,
  title,
  documentConfigs,
}: BaseCVTemplateProps) => {
  return (
    <Document
      title={title || "CV"}
      author="eliseubatista99"
      style={{ width: "100%", height: "100%", position: "relative", flex: 1 }}
      {...documentConfigs}
    >
      {children}
    </Document>
  );
};
