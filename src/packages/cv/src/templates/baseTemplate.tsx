import { Document } from "@react-pdf/renderer";
import React from "react";

type BaseCVTemplateProps = {
  title?: string;
  children?: React.ReactNode;
};

export const BaseCVTemplate = ({ children, title }: BaseCVTemplateProps) => {
  return (
    <Document
      title={title || "CV"}
      author="eliseubatista99"
      style={{ width: "100%", height: "100%", position: "relative", flex: 1 }}
    >
      {children}
    </Document>
  );
};
