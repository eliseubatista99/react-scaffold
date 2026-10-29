import { useEffect, useMemo, useState } from "react";

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type Size = "mobile" | "tablet" | "desktop";

export type BreakpointConfiguration = Record<Breakpoint, number>;
export type BreakpointConfigurationOverrides =
  Partial<BreakpointConfiguration>;

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
  currentHeight: number;
  currentBreakpoint: Breakpoint;
  currentSize: Size;
}

export interface UseResponsiveInput {
  breakpointConfiguration?: BreakpointConfigurationOverrides;
}

export const useResponsive = (
  input?: UseResponsiveInput
): UseResponsiveOutput => {
  const overrides = input?.breakpointConfiguration;
  const breakpointConfiguration = useMemo(
    () => ({
      ...defaultBreakpoints,
      ...overrides,
    }),
    [
      overrides?.xs,
      overrides?.sm,
      overrides?.md,
      overrides?.lg,
      overrides?.xl,
      overrides?.xxl,
    ],
  );

  const [state, setState] = useState<UseResponsiveOutput>(() =>
    getResponsiveOutput(0, 0, breakpointConfiguration),
  );

  useEffect(() => {
    const handleResize = () => {
      setState(
        getResponsiveOutput(
          window.innerWidth,
          window.innerHeight,
          breakpointConfiguration,
        ),
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpointConfiguration]);

  return state;
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
  if (currentWidth < breakpoints.sm) {
    return "mobile";
  } else if (currentWidth < breakpoints.lg) {
    return "tablet";
  } else {
    return "desktop";
  }
};

const getResponsiveOutput = (
  currentWidth: number,
  currentHeight: number,
  breakpoints: BreakpointConfiguration
): UseResponsiveOutput => {
  const currentBreakpoint = getCurrentBreakpoint(currentWidth, breakpoints);
  const currentSize = getCurrentSize(currentWidth, breakpoints);

  return { currentWidth, currentHeight, currentBreakpoint, currentSize };
};
