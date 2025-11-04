import { Document } from "@react-pdf/renderer";
import React from "react";

type BaseCVTemplateProps = {
  children?: React.ReactNode;
};

export const BaseCVTemplate = ({ children }: BaseCVTemplateProps) => {
  return (
    <Document
      title="CV"
      author="eliseubatista99"
      style={{ width: "100%", height: "100%", position: "relative", flex: 1 }}
    >
      {children}
    </Document>
  );
};
