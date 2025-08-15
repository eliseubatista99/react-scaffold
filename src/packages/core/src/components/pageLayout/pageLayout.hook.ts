import React from "react";
import { PageLayoutProps } from "./pageLayout";

export const usePageLayoutHelper = (props: PageLayoutProps) => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);

  const [headerHeight, setHeaderHeight] = React.useState<number>(24);
  const [footerHeight, setFooterHeight] = React.useState<number>(24);

  const executeHeaderCalculations = React.useCallback(() => {
    if (!headerRef.current) {
      return;
    }

    setHeaderHeight(headerRef.current.clientHeight);
  }, [headerRef, headerRef.current]);

  const executeFooterCalculations = React.useCallback(() => {
    if (!footerRef.current) {
      return;
    }

    setFooterHeight(footerRef.current.clientHeight);
  }, [footerRef, footerRef.current]);

  React.useEffect(() => {
    executeHeaderCalculations();
  }, [executeHeaderCalculations, headerRef, headerRef.current]);

  React.useEffect(() => {
    executeFooterCalculations();
  }, [executeFooterCalculations, footerRef, footerRef.current]);

  return {
    header: {
      ...props.header,
      visible: props.header !== undefined,
      height: props.header?.visibility === "fixed" ? 0 : headerHeight,
      ref: headerRef,
    },
    footer: {
      ...props.footer,
      visible: props.footer !== undefined,
      height: props.footer?.visibility === "fixed" ? 0 : footerHeight,
      ref: footerRef,
    },
  };
};
