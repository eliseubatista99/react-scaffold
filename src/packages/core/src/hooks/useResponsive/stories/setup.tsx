import { useResponsive, UseResponsiveInput } from "../useResponsive";

export const UseResponsiveStoriesSetup = (input?: UseResponsiveInput) => {
  const { currentSize, currentBreakpoint, currentWidth } = useResponsive(input);

  return (
    <div style={{ padding: "20px" }}>
      <p>CurrentSize: {currentSize}</p>
      <p>Current Breakpoint: {currentBreakpoint}</p>
      <p>Current Width: {currentWidth}</p>
    </div>
  );
};
