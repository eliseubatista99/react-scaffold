import { useEffect, useRef, useState } from "react";
import type { PageLayoutProps } from "./pageLayout";

export const usePageLayoutHelper = (props: PageLayoutProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const header = headerRef.current;
    const footer = footerRef.current;

    const updateDimensions = () => {
      setHeaderHeight(header?.getBoundingClientRect().height ?? 0);
      setFooterHeight(footer?.getBoundingClientRect().height ?? 0);
    };

    updateDimensions();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }

    const observer = new ResizeObserver(updateDimensions);
    if (header) observer.observe(header);
    if (footer) observer.observe(footer);

    return () => observer.disconnect();
  }, [
    props.header,
    props.header?.content,
    props.header?.style,
    props.footer,
    props.footer?.content,
    props.footer?.style,
  ]);

  return {
    header: {
      ...props.header,
      visible: props.header !== undefined,
      height:
        !props.header || props.header.visibility === "fixed"
          ? 0
          : headerHeight,
      ref: headerRef,
    },
    footer: {
      ...props.footer,
      visible: props.footer !== undefined,
      height:
        !props.footer || props.footer.visibility === "fixed"
          ? 0
          : footerHeight,
      ref: footerRef,
    },
    sidebar: {
      ...props.sidebar,
      visible: props.sidebar !== undefined,
    },
  };
};
