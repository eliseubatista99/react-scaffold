import { useEffect, useMemo, useState } from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type Size = "mobile" | "tablet" | "desktop";

export type BreakpointConfiguration = Record<Breakpoint, number>;

export const defaultBreakpoints: BreakpointConfiguration = {
  xs: 0,
  sm: 420,
  md: 768,
  lg: 991,
  xl: 1200,
  xxl: 1440,
};

export interface UseResponsiveOutput {
  currentWidth: number;
  currentBreakpoint: Breakpoint;
  currentSize: Size;
}

export interface UseResponsiveInput {
  breakpointConfiguration?: BreakpointConfiguration;
}

export const useResponsive = (
  input?: UseResponsiveInput
): UseResponsiveOutput => {
  const breakpointConfiguration = {
    ...defaultBreakpoints,
    ...input?.breakpointConfiguration,
  };

  const [state, setState] = useState<UseResponsiveOutput>(
    getResponsiveOutputFromWindow(breakpointConfiguration)
  );

  const handleResize = () => {
    setState(getResponsiveOutputFromWindow(breakpointConfiguration));
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return useMemo(() => state, [state]);
};

const getCurrentBreakpoint = (
  currentWidth: number,
  breakpoints: BreakpointConfiguration
): Breakpoint => {
  if (currentWidth < breakpoints.sm) {
    return "xs";
  } else if (currentWidth < breakpoints.md) {
    return "sm";
  } else if (currentWidth < breakpoints.lg) {
    return "md";
  } else if (currentWidth < breakpoints.xl) {
    return "lg";
  } else if (currentWidth < breakpoints.xxl) {
    return "xl";
  } else {
    return "xxl";
  }
};

const getCurrentSize = (
  currentWidth: number,
  breakpoints: BreakpointConfiguration
): Size => {
  if (currentWidth <= breakpoints.sm) {
    return "mobile";
  } else if (currentWidth <= breakpoints.md) {
    return "tablet";
  } else {
    return "desktop";
  }
};

const getResponsiveOutputFromWindow = (
  breakpoints: BreakpointConfiguration
): UseResponsiveOutput => {
  const currentWidth = window.innerWidth;
  const currentBreakpoint = getCurrentBreakpoint(currentWidth, breakpoints);
  const currentSize = getCurrentSize(currentWidth, breakpoints);

  return { currentWidth, currentBreakpoint, currentSize };
};
