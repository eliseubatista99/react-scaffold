import React from "react";
import { PageLayoutProps } from "./pageLayout";

export const usePageLayoutHelper = (props: PageLayoutProps) => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const [headerHeight, setHeaderHeight] = React.useState<number>(24);
  const [footerHeight, setFooterHeight] = React.useState<number>(24);
  const [sidebarWidth, setSidebarWidth] = React.useState<number>(300);

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

  const executeSidebarCalculations = React.useCallback(() => {
    if (!sidebarRef.current) {
      return;
    }

    setSidebarWidth(sidebarRef.current.clientWidth);
  }, [sidebarRef, sidebarRef.current]);

  const calculateExtraHeight = React.useCallback(() => {
    let extra = 0;

    if (props.header?.visibility === "always") {
      extra = extra + (headerHeight || 0);
    }

    if (props.footer?.visibility === "always") {
      extra = extra + (footerHeight || 0);
    }

    return extra;
  }, [footerRef, footerRef.current]);

  React.useEffect(() => {
    executeHeaderCalculations();
  }, [executeHeaderCalculations, headerRef, headerRef.current]);

  React.useEffect(() => {
    executeFooterCalculations();
  }, [executeFooterCalculations, footerRef, footerRef.current]);

  React.useEffect(() => {
    executeSidebarCalculations();
  }, [executeSidebarCalculations, sidebarRef, sidebarRef.current]);

  return {
    header: {
      ...props.header,
      visible: props.header !== undefined,
      height:
        !props.header || props.header?.visibility === "fixed"
          ? 0
          : headerHeight,
      ref: headerRef,
    },
    footer: {
      ...props.footer,
      visible: props.footer !== undefined,
      height:
        !props.footer || props.footer?.visibility === "fixed"
          ? 0
          : footerHeight,
      ref: footerRef,
    },
    sidebar: {
      ...props.sidebar,
      width: sidebarWidth,
      visible: props.sidebar !== undefined,
      ref: sidebarRef,
    },
    page: {
      extraHeight: calculateExtraHeight(),
    },
  };
};
