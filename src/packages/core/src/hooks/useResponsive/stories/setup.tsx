import { useResponsive } from "../useResponsive";

export const UseResponsiveStoriesSetup = () => {
  const { device } = useResponsive();

  return (
    <div style={{ padding: "20px" }}>
      <p>{device}</p>
    </div>
  );
};
